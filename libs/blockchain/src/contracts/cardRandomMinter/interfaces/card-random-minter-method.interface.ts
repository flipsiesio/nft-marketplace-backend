import { IWeb3ContractSendMethod } from '@app/blockchain/interfaces';


export interface ICardRandomMinterMethods {
  mintRandomFree: (
    count: number,
    receiverAddress: string,
    description: string
  ) => IWeb3ContractSendMethod<void>;
}
