import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CardRandomMinterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  transaction: string;

  @Column()
  userAddress: string;

  @Column({ type: 'bigint' })
  mintTimestamp: number;

  @Column()
  amount: number;

  @Column()
  requestId: string;
}
