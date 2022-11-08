import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '@app/common/users/users-roles.enum';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ name: 'tron_wallet_address', nullable: false, unique: true })
  tronWalletAddress: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.User,
    nullable: false,
  })
  role: UserRoleEnum;
}
