import { TronWeb } from 'tronweb';
import { TronAbi } from '../abi/types/tronabi.type';

export class TronContract {
  tronWeb: TronWeb;
  abi: TronAbi;
  address: string;
  contract: any;

  constructor(tronWeb: TronWeb, abi?: TronAbi, address?: string) {
    this.tronWeb = tronWeb;
    if (abi) this.abi = abi;
    if (address) this.address = address;
  }

  async create() {
    if (!this.contract) {
      this.contract = await this.tronWeb.contract(
        this.abi.entrys,
        this.address,
      );
    }
    //return this.contract;
  }
}
