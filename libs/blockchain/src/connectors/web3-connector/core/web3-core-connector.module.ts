import { WEB3_ABI_LOADER, WEB3_PROVIDER } from '@app/blockchain/constants';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { HttpProvider, IpcProvider, WebsocketProvider } from 'web3-core';
import { IWeb3AbiLoader, IWeb3ConnectionParams } from '../interfaces';

import net from 'net';
import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';
import { Web3ConnectorService } from '@app/blockchain/connectors/web3-connector/web3-connector.service';


// import Web3 from 'web3';
const Web3 = require('web3');

@Global()
@Module({})
export class Web3CoreConnectorModule {
  static forRoot(
    abiLoader: IWeb3AbiLoader,
    params: IWeb3ConnectionParams,
  ): DynamicModule {
    const { url, connectionType } = params;

    let web3Provider: HttpProvider | WebsocketProvider | IpcProvider;

    switch (connectionType) {
      case Web3ConnectionTypeEnum.HTTP:
        web3Provider = new Web3.providers.HttpProvider(url, {
          keepAlive: true,
        });
        break;
      case Web3ConnectionTypeEnum.WSS:
        web3Provider = new Web3.providers.WebsocketProvider(url, {
          reconnect: {
            auto: true,
            delay: 5000,
            maxAttempts: 10,
            onTimeout: false,
          },
          clientConfig: {
            keepalive: true,
            keepaliveInterval: 30000,
          },
        });
        break;
      case Web3ConnectionTypeEnum.IPC:
        web3Provider = new Web3.providers.IpcProvider(url, net);
        break;
      default:
        throw new Error('Unknown connection type');
    }

    return {
      module: Web3CoreConnectorModule,
      providers: [
        {
          provide: WEB3_PROVIDER,
          useFactory: () => new Web3(web3Provider),
        },
        {
          provide: WEB3_ABI_LOADER,
          useValue: abiLoader,
        },
        Web3ConnectorService,
      ],
      exports: [WEB3_PROVIDER, WEB3_ABI_LOADER, Web3ConnectorService],
    };
  }
}
