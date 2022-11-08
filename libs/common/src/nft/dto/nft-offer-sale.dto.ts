import { ApiProperty } from '@nestjs/swagger';

export class NftOfferSaleDto {
  @ApiProperty()
  cardsAddress: string;

  @ApiProperty()
  cardsStartPrice: string;

  @ApiProperty()
  cardsBuyNowPrice: number;
}
