import { contractCardFactoryAbi, contractCardFactoryAddress } from '../abi';
import { TronContract } from './contract';

export class ContractCardFactory extends TronContract {
  address = contractCardFactoryAddress;
  abi = contractCardFactoryAbi;

  // async create(): Promise<ContractCardFactory> {
  //   return super.create();
  // }
}
