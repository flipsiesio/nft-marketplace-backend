import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  tronWalletAddress: string;
  @ApiProperty()
  accessToken: string;
}
