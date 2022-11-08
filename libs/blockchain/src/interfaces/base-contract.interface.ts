import { IWeb3Contract } from './web3-contract.interfaces';

export interface IBaseContract {
  address: string;
  contract: IWeb3Contract;
  abiFile: string
  deploymentTxnHash: string;
  deploymentBlock: number;

}
