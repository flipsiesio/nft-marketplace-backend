import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SaleAndMintEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  block: number;

  @Column({ type: 'bigint' })
  timestamp: number;

  @Column()
  contract: string;

  @Column()
  tableId: string;

  @Column({ nullable: true })
  transaction?: string;

  @Column({ nullable: true })
  tokenId?: number;

  @Column({ nullable: true })
  createdTokenId?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  method?: string;

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
  address?: string;

  @Column({ nullable: true })
  contractTriger?: string;

  @Column({ nullable: true })
  orderIndex?: number;

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
  buyer?: string;

  @Column({ type: 'numeric', nullable: true })
  price?: string;

  @Column({ nullable: true })
  amount?: string;

  @Column({ nullable: true })
  total?: string;

  @Column({ nullable: true })
  expirationTime?: number;
}
