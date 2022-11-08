import { ApiProperty } from '@nestjs/swagger';

export class NftsFixPriceSaleDto {
  @ApiProperty()
  nftAddress: string;

  @ApiProperty()
  nftPrice: string;
}
