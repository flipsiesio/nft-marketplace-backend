import { ApiProperty } from '@nestjs/swagger';

export class AuthCheckSignDto {
  @ApiProperty()
  walletAddress: string;

  @ApiProperty()
  signature: string;
}
