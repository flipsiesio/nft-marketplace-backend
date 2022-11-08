import { ApiProperty } from '@nestjs/swagger';
import { NftsSuitEnum } from '../enums/nft-suit.enum';

export class NftDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;

  @ApiProperty({ enum: NftsSuitEnum })
  suit: NftsSuitEnum;

  @ApiProperty()
  attribute: string; //TBD

  @ApiProperty()
  owner: string;

  @ApiProperty()
  listingPrice: number;

  @ApiProperty()
  highestPrice: number;

  @ApiProperty()
  bgColor?: string;

  @ApiProperty()
  cardColor?: string;
}
