import { IWeb3ContractSendMethod } from '@app/blockchain/interfaces';

export interface NftMarketplaceMethods {
  getSellOrderSeller: (index: number) => IWeb3ContractSendMethod<string>;

  getSellOrderExpirationTime: (
    index: number,
  ) => IWeb3ContractSendMethod<number>;

  setFeeReceiver: (address: string) => IWeb3ContractSendMethod<void>;

  setGlobalFee: (index: number) => IWeb3ContractSendMethod<boolean>;

  setFee: (index: number) => IWeb3ContractSendMethod<boolean>;

  owner: () => IWeb3ContractSendMethod<string>;
}
