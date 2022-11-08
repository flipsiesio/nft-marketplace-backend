import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum, UsersService } from '@app/common/users';
import { AuthAccessTokenDto } from '../dto/auth-access-token.dto';
import { User } from '@app/common/users/user.entity';
import { ROLES_KEY } from '../decorators/role.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles) return true;
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Unauthorized user',
      });
    }
    const jwtPayload = await this.jwtService.verifyAsync<{tronWalletAddress}>(token);
    const tronWalletAddress = jwtPayload.tronWalletAddress;
    const userDbRecord: User = await this.usersService.findOneByAddress(tronWalletAddress);
    if (!userDbRecord) {
      throw new UnauthorizedException('user not found')
    }
    const userRole: UserRoleEnum = userDbRecord.role;

    if (roles.includes(userRole))  {
      return true;
    } else {
      throw new  ForbiddenException('Forbidden');
      return false;
    }
  }

}
