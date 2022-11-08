import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthJwtTypesEnum } from '../enums/auth-jwt-types.enum';
import { AuthAccessTokenDto } from '../dto/auth-access-token.dto';
import { CreateUserDto } from '@app/common/users/dto/create-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(tronWalletAddress: string): Promise<CreateUserDto> {
    const user = await this.authService.validateUser(
      tronWalletAddress,
      AuthJwtTypesEnum.AccessToken,
    );
    if (!user) {
      throw new UnauthorizedException(
        'Wrong tron-wallet-address string or roles array',
      );
    }
    return user;
  }
}
