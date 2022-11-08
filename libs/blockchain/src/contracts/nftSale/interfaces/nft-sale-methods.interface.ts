import { IWeb3ContractSendMethod } from '@app/blockchain/interfaces';

export interface NftSaleMethods {
  getSellOrderSeller: (
    index: number,
  ) => IWeb3ContractSendMethod<string>;

  getSellOrderPrice: (
    index: number,
  ) => IWeb3ContractSendMethod<string>;

  getSellOrderExpirationTime: (
    index: number,
  ) => IWeb3ContractSendMethod<number>;
}

