import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '@app/config/jwt';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRedis() private readonly redisService: Redis,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<any> {
      return new Promise(async (resolve, reject) => {
          try {
              const isPublic = this.reflector.getAllAndOverride<boolean>(
                  IS_PUBLIC_KEY,
                  [context.getHandler(), context.getClass()],
              );
              if (isPublic) {
                  resolve(true);
                  return true;
              }

              const request = context.switchToHttp().getRequest();
              const accessToken = (<string>request?.headers?.authorization)?.split(
                  ' ',
              )[1];
              console.log(accessToken);


              if (
                  !accessToken ||
                  !await this.jwtService.verifyAsync(accessToken, { secret: JwtConfig.JWT_SECRET })
              ) {
                  reject(new UnauthorizedException('Wrong access token'));
                  return false;
              }

              const sca = await super.canActivate(context);

              console.log(sca, request?.user?.tronWalletAddress);

              if (
                  !(await this.redisService.hget(
                      'accessToken: ' + request?.user?.tronWalletAddress,
                      accessToken,
                  ))
              ) {
                  reject(
                      new UnauthorizedException(
                          'Wrong access token',
                      ),
                  );
                  return false;
              }

              resolve(sca);
          } catch {
              reject(new UnauthorizedException('Wrong access token'));
              return false;
          }
      });
  }
}
