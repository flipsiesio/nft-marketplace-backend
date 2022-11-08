//TODO update feature for admin only

export class UpdateSaleDto {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  tokenAddress?: string;
  sellerAddress?: string;
  buyerAddress?: string;
  salePrice?: number;
  platformFeeAmountPaid?: number;
  saleDate?: Date;
  transactionHash?: string;
}
