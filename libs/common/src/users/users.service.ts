import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoleEnum } from './users-roles.enum';
import { Logger } from 'mongodb';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async adminRemoveAdmin(
    adminExecutorAddress: string,
    adminToRemoveAddress: string,
  ) {
    if (adminExecutorAddress === adminToRemoveAddress) throw new BadRequestException('You cant remove yourself from Admin list.');
    const admin: User = await this.userRepository.findOne({ where: { tronWalletAddress: adminToRemoveAddress } });
    if (!admin) throw new BadRequestException(`Admin with address ${adminToRemoveAddress} not exists.`);
    admin.role = UserRoleEnum.User;
    const user = await this.userRepository.update({ tronWalletAddress: adminToRemoveAddress }, admin);
    this.logger.debug(`Address ${adminToRemoveAddress} is not Admin now.`, user);
  }

  async adminSetNewAdmin(
    adminExecutorAddress: string,
    adminToAddAddress: string,
  ) {
    if (adminExecutorAddress === adminToAddAddress) throw new BadRequestException('You cant update yourself to Admin.');
    const user: User = await this.userRepository.findOne({ where: { tronWalletAddress: adminToAddAddress } });
    if (!user) throw new BadRequestException(`User with address ${adminToAddAddress} not exists.`);
    user.role = UserRoleEnum.Admin;
    const newAdmin = await this.userRepository.update({ tronWalletAddress: adminToAddAddress }, user);
    this.logger.debug(`Address ${adminToAddAddress} is Admin now.`, newAdmin);
  }

  //TODO add admin actions history db, add admins list

  async getUsers(limit: number, offset: number) {
    try {
      const [list, count] = await this.userRepository.findAndCount({
        skip: offset,
        take: limit,
      });
      return { list, count };
    } catch (error) {
      console.log(error);
    }
  }

  async findById(userId: string | number) {
    try {
      return await this.userRepository.findOne({
        where: { id: Number(userId) },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findAdmin() {
    try {
      return await this.userRepository.findOne({
        where: { role: UserRoleEnum.Admin },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findOneByAddress(tronWalletAddress: string) {
    try {
      return await this.userRepository.findOne({
        where: { tronWalletAddress },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userRepository.insert(createUserDto);
    } catch (error) {
      console.log(error);
    }
  }

  async update({
    address,
    updateUserDto,
  }: {
    address: string;
    updateUserDto: UpdateUserDto;
  }) {
    try {
      return await this.userRepository.update(
        { tronWalletAddress: address },
        updateUserDto,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async remove(address: string) {
    try {
      return await this.userRepository.delete({
        tronWalletAddress: address,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
