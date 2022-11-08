import { AbiItem } from 'web3-utils';

export interface IWeb3AbiLoader {
  getAbi: (abiFileName: string) => Promise<AbiItem | AbiItem[]>;
}
