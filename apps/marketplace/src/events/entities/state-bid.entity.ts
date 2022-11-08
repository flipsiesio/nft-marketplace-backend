import { NumericType } from 'mongodb';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StateBidEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  transaction: string;

  @Column()
  orderIndex: number;

  @Column({
      transformer: {
          to(value){
              return value ? value.toLowerCase() : value;
          },
          from(value) {
              return value;
          }
      }
  })
  seller: string;

  @Column({ type: Number, nullable: true })
  tokenId: number;

  @Column({ type: Number, nullable: true })
  createdTokenId: number;

  @Column({ type: 'bigint' })
  timestamp: number;

  @Column()
  expirationTime: number;

  @Column()
  active: boolean;

  // транзакции ставок { [buyer]: { transaction, buyer, price } }
  @Column({ type: 'jsonb', nullable: true })
  bids?: Record<
    string, // buyer
    {
      transaction: string;
      buyer: string;
      timestamp: number;
      price: string;
    }
  >;

  @Column({ type: 'numeric', default: '0', nullable: false })
  bidsSum: string;
}
