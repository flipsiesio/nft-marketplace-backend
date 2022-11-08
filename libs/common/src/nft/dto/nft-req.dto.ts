import { ApiProperty } from '@nestjs/swagger';
import { NftsSuitEnum } from '../enums/nft-suit.enum';
import { NftsFaceEnum } from '../enums/nft-face.enum';
import { NftsStatusEnum } from '../enums/nft-status.enum';

class NftsReqFilter {
  @ApiProperty({ enum: NftsFaceEnum })
  face?: NftsFaceEnum;

  @ApiProperty({ enum: NftsSuitEnum })
  suit?: NftsSuitEnum;
}

export enum NtfsTypeSort {
  price = 'price',
  bid = 'bid',
}

export enum NtfsSortOrder {
  toLargest = 1,
  toSmallest = -1,
}

export class NftsReqDto {
  @ApiProperty()
  limit?: number;

  @ApiProperty()
  skip?: number;

  @ApiProperty({ enum: NtfsTypeSort })
  sort?: NtfsTypeSort;

  @ApiProperty({ enum: NtfsSortOrder })
  sortOrder?: NtfsSortOrder;

  @ApiProperty({ enum: NftsFaceEnum })
  face?: NftsFaceEnum;

  @ApiProperty({ enum: NftsSuitEnum })
  suit?: NftsSuitEnum;

  // @ApiProperty({ type: () => NftsReqFilter })
  // filter?: NftsReqFilter;
}
