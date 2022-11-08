import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { BTTCContractsConfig } from '@app/config/bttc';
import { CardContract } from '@app/blockchain/contracts/card/card.contract';
import { Web3ConnectorService } from '@app/blockchain/connectors/web3-connector/web3-connector.service';
import { NftSaleContract } from '@app/blockchain/contracts/nftSale/nft-sale.contract';
import { NftMarketplaceContract } from '@app/blockchain/contracts/nftMarketplace/nft-marketplace.contract';
import { CardRandomMinterContract } from '@app/blockchain/contracts/cardRandomMinter/card-random-minter.contract';
import BigNumber from 'bignumber.js';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name, {
    timestamp: true,
  });

  private readonly bttcPrivateKey = BTTCContractsConfig.BTTC_PRIVATE_KEY;

  constructor(
    @Inject(BTTCContractsConfig.CONTRACT_CARD)
    readonly cardContract: CardContract,
    readonly web3ConnectorService: Web3ConnectorService,
    @Inject(BTTCContractsConfig.CONTRACT_NFT_SALE)
    readonly nftSaleContract: NftSaleContract,
    @Inject(BTTCContractsConfig.CONTRACT_NFT_MARKETPLACE)
    readonly marketplaceContract: NftMarketplaceContract,
    @Inject(BTTCContractsConfig.CONTRACT_RANDOM_MINTER)
    readonly cardRandomMinterContract: CardRandomMinterContract,
  ) {
  }

  private async signAndSendTransaction(
    transaction,
    privateKey: string,
    address: string,
    gas: string,
    nonce?: number,
  ) {
    try {
      const gasPrice = new BigNumber(await this.web3ConnectorService.getGasPrice()).toString();
      const fullGasPrice = new BigNumber(gasPrice).multipliedBy(1.8).toFixed(0).toString();
      let data = await transaction.then((data)=>{
          return data;
      })

      const signed = await this.web3ConnectorService.signTransaction(
        {
          to: address,
          data: data,
          gas: gas,
          gasPrice: fullGasPrice,
          nonce
        },
        privateKey,
      );

      if (signed?.rawTransaction) {
        return  this.web3ConnectorService.sendSignedTransaction(
          signed.rawTransaction,
        );
      }
    } catch (e) {
      this.logger.error(this.signAndSendTransaction.name + ' ' + e);
      throw new Error(e)
    }
  }

  async mintNft(receiverAddress: string, description: string = '') {
    try {
      const account = this.web3ConnectorService.getAccount(this.bttcPrivateKey);
      const transaction = await this.cardContract.mintNft(receiverAddress,  description);
      const gas = await this.cardContract.estimateGasFee(receiverAddress, account.address, description);
      const result = await this.signAndSendTransaction(transaction, this.bttcPrivateKey, this.cardContract.address, gas.toString());
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('cant mint', error);
    }
  }

  async mintFreeNft(
    count: number,
    receiverAddress: string,
    description: string = '',
  ) {
    try {
      const account = this.web3ConnectorService.getAccount(this.bttcPrivateKey);
      const transaction = this.cardRandomMinterContract.mintFreeNft(count, receiverAddress, description);
      const gas = await this.cardRandomMinterContract.estimateGasFee(count, receiverAddress, account.address, description);
      const result = await this.signAndSendTransaction(transaction, this.bttcPrivateKey, this.cardRandomMinterContract.address, gas.toString());
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('cant mint', error);
    }
  }

  async setFeeReceiver(address: string, admin: string) {
    try {
      const account = this.web3ConnectorService.getAccount(this.bttcPrivateKey);
      const transaction = await this.marketplaceContract.setFeeReceiver(address);
      const gas = await this.marketplaceContract.estimateGasFeeSetFeeReceiver(address, account.address);
      const result = await this.signAndSendTransaction(transaction, this.bttcPrivateKey, this.marketplaceContract.address, gas.toString());
      // _feeReceiver_address
      if (result) {
        console.log(`Admin: ${admin}. setFeeReceiver on marketplace contract to ${address}`);
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async setGlobalFee(feeSize: number, admin: string) {
    try {
      const account = this.web3ConnectorService.getAccount(this.bttcPrivateKey);
      const transaction = await this.marketplaceContract.setGlobalFee(feeSize);
      const gas = await this.marketplaceContract.estimateGasFeeSetGlobalFee(feeSize, account.address);
      const result = await this.signAndSendTransaction(transaction, this.bttcPrivateKey, this.marketplaceContract.address, gas.toString());
      if (result) {
        console.log(`Admin: ${admin}. setFee on marketplace contract to ${feeSize}`);
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
