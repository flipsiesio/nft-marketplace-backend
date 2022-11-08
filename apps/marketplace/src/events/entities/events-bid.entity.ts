import { NumericType } from 'mongodb';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BidEventEnum } from '../enums/bid-event.enum';

//События по торговле
@Entity()
export class EventsBidEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //blockchain

  @Column()
  block: number;

  @Column({ type: 'bigint' })
  timestamp: number;

  @Column()
  contract: string;

  @Column({
    type: 'enum',
    enum: BidEventEnum,
    nullable: false,
  })
  name: BidEventEnum;

  @Column({ unique: true })
  transaction: string;

  //trade

  @Column()
  orderIndex: number;

  @Column({
      nullable: true,
      transformer: {
          to(value){
              return value ? value.toLowerCase() : value;
          },
          from(value) {
              return value;
          }
      }
  })
  seller?: string;

  @Column({ nullable: true })
  tokenId?: number;

  @Column()
  createdTokenId?: number;

  @Column({ nullable: true })
  expirationTime?: number;

  //bid

  @Column({ nullable: true })
  buyer?: string;

  @Column({ nullable: true })
  amount?: string;

  @Column({ nullable: true })
  total?: string;
}
