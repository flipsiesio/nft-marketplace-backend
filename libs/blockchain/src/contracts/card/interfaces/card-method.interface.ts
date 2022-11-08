import { IWeb3ContractSendMethod } from '@app/blockchain/interfaces';


export interface ICardMethods {
  getNFTListByAddress: (
    address: string,
  ) => IWeb3ContractSendMethod<number[]>;
  tokenURI: (tokenId: number) => IWeb3ContractSendMethod<any>;
  mint: (
    receiverAddress: string,
    tokenId: number,
    description: string
  ) => IWeb3ContractSendMethod<any>;
  balanceOf: (address: string) => IWeb3ContractSendMethod<any>;
}
