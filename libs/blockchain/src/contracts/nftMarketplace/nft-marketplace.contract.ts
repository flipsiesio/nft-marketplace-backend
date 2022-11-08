import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IBaseContract, IWeb3Contract } from '@app/blockchain/interfaces';
import { NftMarketplaceMethods } from '@app/blockchain/contracts/nftMarketplace/interfaces/nft-marketplace-method.inteface';
import { NftMarketplaceEvents } from '@app/blockchain/contracts/nftMarketplace/interfaces/nft-marketplace-events.interface';
import {
  CardContractEvents,
  MarketplaceContractEvents,
} from '@app/blockchain/enums';
import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';

export class NftMarketplaceContract implements IBaseContract {
  contract: IWeb3Contract<NftMarketplaceMethods, NftMarketplaceEvents>;

  blockLimit: number;
  eventBlockNumberCounter: Record<string, number>;
  logger: Logger;

  constructor(
    public address: string,
    public abiFile: string,
    public deploymentTxnHash: string,
    public deploymentBlock: number,
  ) {
    this.eventBlockNumberCounter = {
      [MarketplaceContractEvents.ALL_EVENTS]: this.deploymentBlock,
    };
  }

  async getPastEvents(
    event: MarketplaceContractEvents,
    web3: Web3,
  ): Promise<EventData[]> {
    let result = [];
    const lastRequestedBlock = this.eventBlockNumberCounter[event];
    const latestBlock = await web3.eth.getBlockNumber();
    const interval = latestBlock - lastRequestedBlock;
    for (
      let fromBlock = lastRequestedBlock,
        toBlock = this.blockLimit
          ? lastRequestedBlock + this.blockLimit > latestBlock
            ? latestBlock
            : lastRequestedBlock + this.blockLimit
          : latestBlock;
      fromBlock < latestBlock;
      this.blockLimit
        ? (fromBlock += this.blockLimit)
        : (fromBlock = latestBlock),
        toBlock + this.blockLimit > latestBlock
          ? (toBlock = latestBlock)
          : (toBlock += this.blockLimit)
    ) {
      const percentage = (
        ((toBlock - lastRequestedBlock) / interval) *
        100
      ).toFixed(2);
      console.debug(
        `Requesting ${event} events in blocks ${fromBlock}-${toBlock}/${latestBlock} ${percentage}%`,
      );
      const events = await this.contract.getPastEvents(event, {
        fromBlock,
        toBlock,
      });
      if (events.length) {
        console.debug(
          `Found ${events.length} in blocks ${fromBlock}-${toBlock}`,
        );
      }
      result = result.concat(events);
    }
    this.eventBlockNumberCounter[event] = latestBlock;
    return result;
  }

  async marketplaceGetSellOrderSeller(orderIndex: number) {
    return await this.contract.methods.getSellOrderSeller(orderIndex).call();
  }

  async getAdminAddress() {
    return await this.contract.methods.owner().call();
  }

  async marketplaceGetSellOrderExpirationTime(orderIndex: number) {
    return await this.contract.methods
      .getSellOrderExpirationTime(orderIndex)
      .call();
  }

  async setFeeReceiver(address: string) {
    return this.contract.methods.setFeeReceiver(address);
  }

  async setGlobalFee(feeSize: number) {
    return this.contract.methods.setFee(feeSize);
  }

  async estimateGasFeeSetFeeReceiver(address: string, accountAddress: string) {
    try {
      return await this.contract.methods
        .setFeeReceiver(address)
        .estimateGas({ from: accountAddress });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'cant estimate transaction',
        error,
      );
    }
  }

  async estimateGasFeeSetGlobalFee(feeSize: number, accountAddress: string) {
    try {
      return await this.contract.methods
        .setFee(feeSize)
        .estimateGas({ from: accountAddress });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'cant estimate transaction',
        error,
      );
    }
  }
}
