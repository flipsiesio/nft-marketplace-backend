import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtConfig } from '@app/config/jwt';
import { AuthJwtTypesEnum } from '../enums/auth-jwt-types.enum';
import { AuthAccessTokenDto } from '../dto/auth-access-token.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConfig.JWT_SECRET,
    });
  }

  // canActivate
  //TODO add  AuthAccessTokenDto
  async validate(payload: AuthAccessTokenDto) {
    const isBlocked = await this.authService.checkBlock({
      tronWalletAddress: payload.tronWalletAddress,
    });
    console.log(payload);
    console.log(isBlocked);
    if (isBlocked)
      throw new UnauthorizedException(
        'Wrong tron-wallet-address is blocked, sign in again',
      );
    if (payload.tokenType === AuthJwtTypesEnum.AccessToken) {
      return {
        tronWalletAddress: payload.tronWalletAddress,
        tokenType: payload.tokenType,
      };
    }
    throw new UnauthorizedException(
      'Wrong tron-wallet-address string or roles array',
    );
  }
}
