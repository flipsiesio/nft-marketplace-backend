import { Inject, Injectable } from '@nestjs/common';

import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import Web3 from 'web3';
import { Account, TransactionConfig } from 'web3-core';
import { WEB3_PROVIDER } from '@app/blockchain/constants';

@Injectable()
export class Web3ConnectorService {
  constructor(
    @Inject(WEB3_PROVIDER)
    private readonly web3: Web3,
  ) {}

  connectContract(contractAddress: string, abi: AbiItem | AbiItem[]): Contract {
    try {
      return new this.web3.eth.Contract(abi, contractAddress);
    } catch (e) {
      console.log('connectContract Error', e);
    }
  }

  getAccount(privateKey: string): Account {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }

  async signTransaction(
    transactionConfig: TransactionConfig,
    privateKey: string,
  ) {
    return this.web3.eth.accounts.signTransaction(
      transactionConfig,
      privateKey,
    );
  }

  async sendSignedTransaction(signedTransactionData: string) {
    return this.web3.eth.sendSignedTransaction(signedTransactionData);
  }

  async getGasPrice() {
    return this.web3.eth.getGasPrice();
  }
}
