// import * as ImportTronWeb from 'tronweb';

// export class Contract {
//   at(address: string): Contract;

//   totalSupply();
//   call();
// }

// export class Provider {
//   constructor(address: string) {}
// }

// export class TronWeb extends ImportTronWeb {
//   constructor(
//     fullNode: Provider,
//     solidityNode: Provider,
//     eventServer: Provider,
//     privateKey: string,
//   ) {
//     super(fullNode, solidityNode, eventServer, privateKey);
//   }

//   static providers: {
//     HttpProvider: typeof Provider;
//   };

//   address: {
//     toHex(address: string);
//     fromHex(address: string);
//     fromPrivateKey(privateKey: string);
//   };

//   async contract(abi?: any, contractAddress?: string)/*: Promise<Contract>*/ {
//     return super.contract(abi, contractAddress);
//   }

//   createAccount() {
//     return super.createAccount();
//   }

//   fromUtf8(data: string): string { return super.fromUtf8(data); }
//   fromDecimal(data)  { return super.fromDecimal(data); }
//   fromSun(data)  { return super.fromSun(data); }
//   getEventByTransactionID(transactionHash: string): Array<any> { return super.getEventByTransactionID(transactionHash); }
//   getEventResult(contractAddress: string, options: {
//     sinceTimestamp?,
//     eventName?,
//     blockNumber?,
//     size?,
//     onlyConfirmed?,
//     onlyUnconfirmed?,
//     fingerprint?,
//     sort?
//   }, callback?) { return super.getEventResult(contractAddress, options, callback); }

//   toHex(str: string | number) { return super.toHex(str); }
//   toAscii(data: string) { return super.toAscii(data); }

//   setHeader(headers: { [key: string]: string }) { return super.setHeader(headers); }
//   setAddress(address: string) { return super.setAddress(address); }
//   setPrivateKey(privateKey: string) { return super.setPrivateKey(privateKey); }

//   sha3(byteArray: any) { return super.sha3(byteArray); }

//   trx: {
//     getCurrentBlock(): Promise<{ block_header: { raw_data: { timestamp: number } } }>;
//     verifyMessage(hexMsg: string, signedMsg: string, address: string);
//     getTransactionInfo(transactionHash: string): Promise<TransactionInfo>;
//   };

//   utils: any;
// }

// // export const TronWeb: AbstractTronWeb = ImportTronWeb;
