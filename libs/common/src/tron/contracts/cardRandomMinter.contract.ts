import { InternalServerErrorException } from '@nestjs/common';
import {
  contractCardRandomMinterAbi,
  contractCardRandomMinterAddress,
} from '../abi';
import { TronContract } from './contract';

export class ContractCardRandomMinter extends TronContract {
  address = contractCardRandomMinterAddress;
  abi = contractCardRandomMinterAbi;

  // async create(): Promise<ContractCardRandomMinter> {
  //   return super.create();
  // }

  async mintFreeNft(
    count: number,
    receiverAddress: string,
    description: string = '',
  ) {
    // const result = await this.cardRandomMinterContract.mintRandomFree(count, address).send(); //TODO then use this method
    try {
      const result = await this.contract
        .mintRandomFree(count, receiverAddress, description)
        .send();
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('cant mint', error);
    }
  }
}
