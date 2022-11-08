export class CreateSaleDto {
  id?: number; // delete later
  createdAt?: Date;
  updatedAt?: Date;
  saleDate: Date;
  tokenAddress: string;
  sellerAddress: string;
  buyerAddress: string;
  salePrice: number;
  platformFeeAmountPaid: number;
  transactionHash: string;
}
