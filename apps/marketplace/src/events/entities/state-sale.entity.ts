import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StateSaleEntity {
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

  @Column({ type: 'numeric', nullable: true })
  price?: string;
}
