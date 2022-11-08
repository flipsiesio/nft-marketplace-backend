import { UserRoleEnum } from '../users-roles.enum';

export class CreateUserDto {
  tronWalletAddress: string;
  role?: UserRoleEnum;
}
