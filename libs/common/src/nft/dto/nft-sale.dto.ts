import { ApiProperty } from '@nestjs/swagger';

export class NftsSaleDto {
  @ApiProperty()
  tokenId: string; //tokenAddress

  @ApiProperty()
  sellerAddress: string;

  @ApiProperty()
  buyerAddress: string;

  @ApiProperty()
  salePrice: number;

  @ApiProperty()
  platformFeeAmountPaid: number;

  @ApiProperty()
  saleDate: Date;

  @ApiProperty()
  transactionHash: string;
}
