import { ApiProperty } from '@nestjs/swagger';

export class AuthCheckRefreshDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  tronWalletAddress: string;
}
