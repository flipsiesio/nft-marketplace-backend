import { TronConfig } from '@app/config/tron';
import { WalletConfig } from '@app/config/wallet';
import * as TronWeb from 'tronweb';
import { Injectable } from '@nestjs/common';

import { TronContract, TronContracts, TronContractsType } from './contracts';

@Injectable()
export class TronService { 
  readonly tronWeb: TronWeb;
  readonly contracts: TronContractsType;

  static async create(): Promise<TronService> {
    try {
      const HttpProvider = TronWeb.providers.HttpProvider;
      const fullNode = new HttpProvider(TronConfig.FULL_NODE);
      const solidityNode = new HttpProvider(TronConfig.SOLIDITY_NODE);
      const eventServer = new HttpProvider(TronConfig.EVENT_SERVER);
      const privateKey = TronConfig.PRIVATE_KEY;
      const tronWeb = new TronWeb(
        fullNode,
        solidityNode,
        eventServer,
        privateKey,
      );

      await tronWeb.setHeader({ [TronConfig.API_HEADER]: TronConfig.API_KEY });
      await tronWeb.setAddress(WalletConfig.ADDRESS);
      await tronWeb.setPrivateKey(WalletConfig.PRIVATE_KEY);
      const contracts = {};
      await Promise.all(
        Object.keys(TronContracts).map(async contractName => {
          const contract: TronContract = new TronContracts[contractName](
            tronWeb,
          );
          contracts[contractName] = contract;
          return contract.create();
        }),
      );

      return new TronService(tronWeb, <TronContractsType>contracts);
    } catch (error) {
      console.log(error);
    }
  }

  private constructor(tronWeb: TronWeb, contracts: TronContractsType) {
    this.tronWeb = tronWeb;
    this.contracts = contracts;
  }
}

