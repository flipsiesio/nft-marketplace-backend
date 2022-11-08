import { ApiProperty } from '@nestjs/swagger';
import { AuthJwtTypesEnum } from '../enums/auth-jwt-types.enum';

export class AuthAccessTokenDto {
  @ApiProperty()
  tronWalletAddress: string;

  @ApiProperty({ enum: AuthJwtTypesEnum })
  tokenType: AuthJwtTypesEnum.AccessToken;
}
