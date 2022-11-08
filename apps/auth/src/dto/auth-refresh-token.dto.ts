import { ApiProperty } from '@nestjs/swagger';
import { AuthJwtTypesEnum } from '../enums/auth-jwt-types.enum';

export class AuthRefreshTokenDto {
  @ApiProperty()
  tronWalletAddress: string;

  @ApiProperty()
  tokenType: AuthJwtTypesEnum.RefreshToken;
}
