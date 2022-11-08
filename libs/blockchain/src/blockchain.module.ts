import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { IBaseContract } from '@app/blockchain/interfaces';
import { CardContract } from '@app/blockchain/contracts/card/card.contract';
import { CardRandomMinterContract } from '@app/blockchain/contracts/cardRandomMinter/card-random-minter.contract';
import { NftMarketplaceContract } from '@app/blockchain/contracts/nftMarketplace/nft-marketplace.contract';
import { NftSaleContract } from '@app/blockchain/contracts/nftSale/nft-sale.contract';
import { BTTCContractsConfig } from '@app/config/bttc';
import { Web3ConnectorModule } from '@app/blockchain/connectors/web3-connector/web3-connector.module';
import { Web3AbiLoader } from '@app/blockchain/connectors/web3-connector/core';
import { join } from 'path';
import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';

const baseContracts: IBaseContract[] = [
  new CardContract(BTTCContractsConfig.CONTRACT_CARD, 'card', BTTCContractsConfig.BTTC_CARD_DEPLOYMENT_HASH, BTTCContractsConfig.BTTC_CARD_DEPLOYMENT_BLOCK),
  new CardRandomMinterContract(BTTCContractsConfig.CONTRACT_RANDOM_MINTER, 'cardRandomMinter',  BTTCContractsConfig.BTTC_RANDOM_MINTER_DEPLOYMENT_HASH, BTTCContractsConfig.BTTC_RANDOM_MINTER_DEPLOYMENT_BLOCK),
  new NftMarketplaceContract(BTTCContractsConfig.CONTRACT_NFT_MARKETPLACE, 'NFTMarketplace', BTTCContractsConfig.BTTC_NFT_MARKETPLACE_DEPLOYMENT_HASH,  BTTCContractsConfig.BTTC_NFT_MARKETPLACE_DEPLOYMENT_BLOCK),
  new NftSaleContract(BTTCContractsConfig.CONTRACT_NFT_SALE, 'NFTSale',  BTTCContractsConfig.BTTC_NFT_SALE_DEPLOYMENT_HASH, BTTCContractsConfig.BTTC_NFT_SALE_DEPLOYMENT_BLOCK),
];

@Module({
  imports: [
    Web3ConnectorModule.forRoot(
      new Web3AbiLoader(join(process.cwd(), 'files', 'abi')),
      {url: BTTCContractsConfig.URL, connectionType: Web3ConnectionTypeEnum.HTTP},
    ),
    Web3ConnectorModule.forFeature(baseContracts),
  ],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
