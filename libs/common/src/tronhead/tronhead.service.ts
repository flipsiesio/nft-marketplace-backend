import { Injectable } from '@nestjs/common';
import { TronContract, TronContractsType } from '../tron/contracts';
import { TronService } from '../tron/tron.service';
import * as TronWeb from 'tronweb';
import { RequestService } from '../request/request.service';
import { TronscanTransactionInfo } from './types/tronscan-transaction-info.type';
import { TransactionInfo } from './types/transaction-info.type';
import { intervalAttempts } from '../attempts/attempts';
import { TronConfig } from '@app/config/tron';

@Injectable()
export class TronHeadService {
  web: TronWeb;
  contracts: TronContractsType;

  constructor(
    private readonly tronService: TronService,
    private readonly http: RequestService,
  ) {
    this.web = this.tronService.tronWeb;
    this.contracts = this.tronService.contracts;
  }

  async adminSetGlobalSellingFee(feeSize: number) {
    const result = this.contracts.marketplace.setGlobalFee(feeSize, '');
    return result;
  }

  async signMessage(message: string | number): Promise<string> {
    var hexStr = this.web.toHex(message).replace(/^0x/, '');
    // convert hex string to byte array
    const byteArray = this.web.utils.code.hexStr2byteArray(hexStr);
    // keccak256 computing, then remove "0x"
    const strHash = this.web.sha3(byteArray).replace(/^0x/, '');

    var signedStr = await this.web.trx.sign(strHash, TronConfig.PRIVATE_KEY);

    return signedStr;
  }

  async getCurrentBlock() {
    return this.web.trx.getCurrentBlock();
  }

  async getCurrentTimestamp(js = true) {
    return (
      Number((await this.getCurrentBlock()).block_header.raw_data.timestamp) *
      (js ? 1 / 1000 : 1)
    );
  }

  addressToHex(value: string): string {
    return this.web.toHex(value);
  }

  addressFromHex(address: string): string {
    return this.web.address.fromHex(address);
  }

  hashMessage(str: string): string {
    // convert to hex format and remove the beginning "0x"
    const hexStrWithout0x = this.web.toHex(str).replace(/^0x/, '');
    // conert hex string to byte array
    const byteArray = this.web.utils.code.hexStr2byteArray(hexStrWithout0x);
    // keccak256 computing, then remove "0x"
    const strHash = this.web.sha3(byteArray).replace(/^0x/, '');
    return strHash;
  }

  verifyMessage(
    hexMsg: string,
    signedMsg: string,
    address: string,
  ): Promise<boolean> {
    return this.web.trx.verifyMessage(hexMsg, signedMsg, address);
  }

  async getTransactionInfo(hash: string): Promise<TransactionInfo> {
    const info = await this.web.trx.getTransactionInfo(hash);
    if (!info.id) {
      return null;
    } else {
      return info;
    }
  }

  async getTransaction(hash: string) {
    const response = await this.web.trx.getTransaction(hash);
    return response;
  }

  async getTronscanTransactionInfo(
    hash: string,
    tronscan = process.env.TRONSCAN,
  ): Promise<TronscanTransactionInfo> {
    try {
      const response = await this.http.requestGet(
        `${tronscan}/api/transaction-info?hash=${hash}`,
      );
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  async getTronscanTransaction(
    hash: string = '=-timestamp&count=true&limit=20&start=0&address=TDkwqpngcjyV2G3cx7VHkejjfmozkMftZ7',
    tronscan = process.env.TRONSCAN,
  ) {
    //убрал тип
    try {
      const response = await this.http.requestGet(
        `${tronscan}/api/transaction?sort=${hash}`,
        //https://shastapi.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=TAY5QVAWvhPzxaPbGiz1ezG4GqvPoWxEbW
        //https://shastapi.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=TDkwqpngcjyV2G3cx7VHkejjfmozkMftZ7
        //  https://shastapi.tronscan.org/api/contracts/smart-contract-triggers-batch?fields=hash,method
        // /shastapi.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=TDkwqpngcjyV2G3cx7VHkejjfmozkMftZ7
      );
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  async getTronscanContract(hash: string, tronscan = process.env.TRONSCAN) {
    try {
      const response = await this.http.requestPost(
        `${tronscan}/api/contracts/smart-contract-triggers-batch?fields=hash,method`,
        JSON.stringify({
          hashList: [`${hash}`],
        }),
        //  https://shastapi.tronscan.org/api/contracts/smart-contract-triggers-batch?fields=hash,method
      );
      // console.log(JSON.parse(response));
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  async getTronscanTransactionInfoWait(
    hash: string,
    condition = (transaction: TronscanTransactionInfo): boolean => {
      return !!transaction.block;
    },
    tronscan = process.env.TRONSCAN,
    attempts = 10,
    interval = 1000,
  ): Promise<TronscanTransactionInfo> {
    return <TronscanTransactionInfo>(<unknown>intervalAttempts(
      () => {
        return this.getTronscanTransactionInfo(hash, tronscan);
      },
      condition,
      attempts,
      interval,
    ));

    // let attempt = 0;
    // {
    //   const transaction = await this.getTronscanTransactionInfo(hash, net);
    //   if (condition(transaction)) {
    //     return transaction;
    //   }
    // }
    // return new Promise((resolve, reject) => {
    //   const intervalAttempts = setInterval(async () => {
    //     try {
    //       const transaction = await this.getTronscanTransactionInfo(hash, net);
    //       if (condition(transaction)) {
    //         clearInterval(intervalAttempts);
    //         resolve(transaction);
    //       }
    //       if (++attempt > attempts) {
    //         clearInterval(intervalAttempts);
    //         return null;
    //       }
    //     } catch (e) {
    //       reject(e);
    //     }
    //   }, interval);
    // });

    //return transaction;
  }

  async getTronscanSmartContractTriggersBatch(
    transactionsHash: string[],
    tronscan = process.env.TRONSCAN,
  ) {
    try {
      return JSON.parse(
        await this.http.requestPost(
          `${tronscan}/api/contracts/smart-contract-triggers-batch?fields=hash,method`,
          JSON.stringify({ hashList: transactionsHash }),
        ),
      );
    } catch {
      return null;
    }
  }

  async getTronscanSmartContractTriggersBatchWait(
    transactionsHash: string[],
    condition = (transaction): boolean => {
      return !!transaction?.event_list;
    },
    tronscan = process.env.TRONSCAN,
    attempts = 10,
    interval = 1000,
  ) {
    return intervalAttempts(
      () => {
        return this.getTronscanSmartContractTriggersBatch(
          transactionsHash,
          tronscan,
        );
      },
      condition,
      attempts,
      interval,
    );
  }

  async getEventResult(
    contractAddress: string,
    options: {
      sinceTimestamp?: number;
      eventName?: string;
      blockNumber?: number;
      size?: number;
      onlyConfirmed?: boolean;
      onlyUnconfirmed?: boolean;
      fingerprint?: string;
      sort?: string;
    } = {},
  ): Promise<
    {
      block: number;
      timestamp: number;
      contract: string;
      name: string;
      transaction: string;
      result: {
        index: string;
        rng: string;
        timestamp: string;
      };
      resourceNode: string;
      fingerprint?: string;
    }[]
  > {
    return this.web.getEventResult(contractAddress, options);
  }

  // Проходится по всем событиям контракта(events)
  async foreachEventsFingerprint(
    contractAddress: string,
    callback: Function,
    options: {
      sinceTimestamp?: number;
      eventName?: string;
      blockNumber?: number;
      size?: number;
      onlyConfirmed?: boolean;
      onlyUnconfirmed?: boolean;
      fingerprint?: string;
      sort?: string;
    } = { fingerprint: '' },
  ) {
    const result = await this.getEventResult(contractAddress, options);
    let lastFingerprint = options.fingerprint ? options.fingerprint : '';
    if (result.length) {
      let fingerprint = result[result.length - 1].fingerprint;
      const cb = callback(result, fingerprint);
      if (!fingerprint) {
        return lastFingerprint;
      }

      if (cb == false) {
        return fingerprint;
      }

      lastFingerprint = await this.foreachEventsFingerprint(
        contractAddress,
        callback,
        Object.assign(options, { fingerprint }),
      );
    }
    return lastFingerprint;
  }

  // Проходится по всем событиям(events) с контракта, а также продолжает их прослушивать
  async eventsListenFingerprint(
    contract: string,
    callback: Function = (events: [], nextfingerprint: string) => { },
    callbackOut: Function = () => { },
    size = 100,
    timeout = 7000,
    fingerprint = '',
    lastReaded = 0,
  ) {
    const read = async () => {
      await this.foreachEventsFingerprint(
        contract,
        (events, nextfingerprint) => {
          if (fingerprint != nextfingerprint) {
            if (nextfingerprint) {
              callback(events, nextfingerprint);
              lastReaded = 0;
              fingerprint = nextfingerprint;
              console.log(fingerprint);
            } else {
              events = events.slice(lastReaded);
              if (events.length) {
                callback(events, nextfingerprint);
                lastReaded = events.length;
              }
            }
          }
        },
        { size, sort: '-block_timestamp', fingerprint },
      );
      // await this.foreachEvents(contract, (events, nextfingerprint)=>{
      //   if (fingerprint != nextfingerprint) {
      //           if (nextfingerprint) {
      //             callback(events, nextfingerprint);
      //             lastReaded = 0;
      //             fingerprint = nextfingerprint;
      //             console.log(fingerprint);
      //           } else {
      //             events = events.slice(lastReaded);
      //             if (events.length) {
      //               callback(events, nextfingerprint);
      //               lastReaded = events.length;
      //             }
      //           }
      //         }
      // });
    };

    await read();

    return setInterval(() => {
      if (!callbackOut()) {
        read();
      }
    }, timeout);
  }

  async foreachEvents(
    contractAddress: string,
    callback: Function,
    options: {
      sinceTimestamp?: number;
      eventName?: string;
      blockNumber?: number;
      size?: number;
      onlyConfirmed?: boolean;
      onlyUnconfirmed?: boolean;
      fingerprint?: string;
      sort?: string;
    } = {},
  ) {
    if (!options.sort) {
      options.sort = 'block_timestamp';
    }
    if (!options.size) {
      options.size = 100;
    }
    options.size = Math.max(2, options.size);

    const result = await this.getEventResult(contractAddress, options);
    const timestamp: number = options.sinceTimestamp;

    if (options.sinceTimestamp) {
      result.shift();
    }

    if (result.length) {
      let nexttimestamp = result[result.length - 1].timestamp;
      if (nexttimestamp != timestamp) {
        if (callback(result, nexttimestamp) == false) {
          return nexttimestamp;
        }

        return this.foreachEvents(
          contractAddress,
          callback,
          Object.assign(options, { sinceTimestamp: nexttimestamp }),
        );
      }
    }

    return timestamp;
  }

  async eventsListen(
    contract: string,
    callback: Function = (events: [], nextSinceTimestamp: number) => { },
    callbackOut: Function = () => { },
    size = 100,
    timeout = 7000,
    sinceTimestamp?: number,
  ) {
    const read = async () => {
      sinceTimestamp = await this.foreachEvents(contract, callback, {
        size,
        sinceTimestamp,
      });
    };

    await read();

    return setInterval(() => {
      if (!callbackOut()) {
        read();
      }
    }, timeout);
  }
}
