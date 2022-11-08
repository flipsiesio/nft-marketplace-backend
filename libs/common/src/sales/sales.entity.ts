import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'token-address', nullable: false })
  tokenAddress: string;

  @Column({ name: 'seller-address', nullable: false })
  sellerAddress: string;

  @Column({ name: 'buyer-address', nullable: false })
  buyerAddress: string;

  @Column()
  salePrice: number;

  @Column()
  platformFeeAmountPaid: number;

  @Column()
  saleDate: Date;

  @Column()
  transactionHash: string;
}
