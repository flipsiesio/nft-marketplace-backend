import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MintEntity {
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
  method: string;

  @Column()
  transaction: string;

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
  address: string;

  @Column({ unique: true })
  tokenId: number;

  @Column()
  contractTriger: string;
}
