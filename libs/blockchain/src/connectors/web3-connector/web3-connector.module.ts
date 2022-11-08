import { DynamicModule, Module, Provider } from '@nestjs/common';

import { Web3CoreConnectorModule } from './core';
import { IWeb3AbiLoader, IWeb3ConnectionParams } from './interfaces';
import { Web3ConnectorService } from '@app/blockchain/connectors/web3-connector/web3-connector.service';
import { IBaseContract } from '@app/blockchain/interfaces';
import { WEB3_ABI_LOADER } from '@app/blockchain/constants';

@Module({})
export class Web3ConnectorModule {
  static forRoot(
    abiLoader: IWeb3AbiLoader,
    params: IWeb3ConnectionParams,
  ): DynamicModule {
    return {
      module: Web3ConnectorModule,
      imports: [Web3CoreConnectorModule.forRoot(abiLoader, params)],
    };
  }

  static forFeature(baseContracts: IBaseContract[]): DynamicModule {
    if (!baseContracts.length) {
      return {
        module: Web3ConnectorModule,
      };
    }

    const providers: Provider[] = [];

    const forExports: string[] = [];

    baseContracts.forEach((contract) => {
      forExports.push(contract.address);
    });

    baseContracts.forEach((contract) => {
      providers.push({
        provide: contract.address,
        useFactory: async (
          web3ConnectorService: Web3ConnectorService,
          web3AbiLoader: IWeb3AbiLoader,
        ) => {
          const abi = await web3AbiLoader.getAbi(contract.abiFile);
          // eslint-disable-next-line no-param-reassign
          contract.contract = await web3ConnectorService.connectContract(
            contract.address,
            abi,
          );
          return contract;
        },
        inject: [Web3ConnectorService, WEB3_ABI_LOADER],
      });
    });

    return {
      module: Web3ConnectorModule,
      providers,
      exports: [...forExports],
    };
  }
}
