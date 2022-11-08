import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

export enum JackpotStatusEnum {
  NotVerified,
  Waiting,
  Sended,
}

@Entity()
export class JackpotWatchlistEntity {
  @PrimaryColumn()
  requestId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userAddress: string;

  @Column({
    type: 'enum',
    enum: JackpotStatusEnum,
    default: JackpotStatusEnum.NotVerified,
  })
  status: JackpotStatusEnum;

  @Column({ default: false })
  viewed: boolean;

  @Column({ nullable: true, default: null })
  tokenId: string;

  @Column({ nullable: true, default: null, type: 'bigint' })
  mintTimestamp: number;

  @Column({ nullable: true, default: null })
  amount: number;
}
