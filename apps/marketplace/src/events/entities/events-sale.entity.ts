import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SaleEventEnum } from '../enums/sale-event.enum';

//События по торговле
@Entity()
export class EventsSaleEntity {
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
    enum: SaleEventEnum,
    nullable: false,
  })
  name: SaleEventEnum;

  @Column({ unique: true })
  transaction: string;

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
  buyer?: string;

  @Column({ type: 'numeric', nullable: true })
  price?: string;

  @Column({ nullable: true })
  tokenId?: number;

  @Column()
  createdTokenId?: number;

  @Column({ nullable: true })
  expirationTime?: number;
}
