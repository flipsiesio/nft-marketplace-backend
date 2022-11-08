import { contractMarketplaceAbi, contractMarketplaceAddress } from '../abi';
import { TronContract } from './contract';

export class ContractMarketplace extends TronContract {
  address = contractMarketplaceAddress;
  abi = contractMarketplaceAbi;

  // async create(): Promise<ContractMarketplace> {
  //   return super.create();
  // }

  async marketplaceGetSellOrderSeller(orderIndex: number) {
    return this.tronWeb.address.fromHex(
      await this.contract.getSellOrderSeller(orderIndex).call(),
    );
  }

  async marketplaceGetSellOrderExpirationTime(orderIndex: number) {
    return Number(
      await this.contract.getSellOrderExpirationTime(orderIndex).call(),
    );
  }

  async setFeeReceiver(address: string, admin: string) {
    try {
      const result = await this.contract.setFeeReceiver(address).send(); // _feeReceiver_address
      if (result) {
        console.log(`Admin: ${admin}. setFeeReceiver on marketplace contract to ${address}`);
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async setGlobalFee(feeSize: number, admin: string) {
    try {
      const result = await this.contract.setFee(feeSize).send(); // _fee_uint256
      if (result) {
        console.log(`Admin: ${admin}. setFee on marketplace contract to ${feeSize}`);
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
