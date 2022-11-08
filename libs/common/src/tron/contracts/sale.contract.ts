import { timeout } from '@app/common/utils/src';
import { contractSaleAbi, contractSaleAddress } from '../abi';
import { TronContract } from './contract';

type RepeatGetTry<T> = () => Promise<T>;

class ErrorStack<T extends Error> extends Error {
  constructor(public message: string, public stackError?: T[]) {
    super(message);
    this.stackError = stackError;
  }
}

export class ContractSale extends TronContract {
  address = contractSaleAddress;
  abi = contractSaleAbi;

  // async create(): Promise<ContractSale> {
  //   return super.create();
  // }

  private async repeatTry<T>(rtry: RepeatGetTry<T>, count = 10) {
    const errorStack: Error[] = [];
    for (let i = 0; i < count; ++i) {
      try {
        const result = await rtry();
        return result;
      } catch (error) {
        console.log('TronContract ERROR: ', error.message);
        errorStack.push(error);
      }
      await timeout(500);
    }
    throw new ErrorStack('Failed to get a response from the Tron', errorStack);
  }

  async saleGetSellOrderSeller(orderIndex: number) {
    return this.repeatTry(async () =>
      this.tronWeb.address.fromHex(
        await this.contract.getSellOrderSeller(orderIndex).call(),
      ),
    );
  }

  async saleGetSellOrderPrice(orderIndex: number) {
    return this.repeatTry(async () =>
      Number(
        this.tronWeb.address.fromHex(
          await this.contract.getSellOrderPrice(orderIndex).call(),
        ),
      ),
    );
  }

  async saleGetSellOrderExpirationTime(orderIndex: number) {
    return this.repeatTry(async () =>
      Number(await this.contract.getSellOrderExpirationTime(orderIndex).call()),
    );
  }
}
