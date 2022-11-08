import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IBaseContract, IWeb3Contract } from '@app/blockchain/interfaces';
import { NftSaleMethods } from '@app/blockchain/contracts/nftSale/interfaces/nft-sale-methods.interface';
import { NftSaleEvents } from '@app/blockchain/contracts/nftSale/interfaces/nft-sale-events.interface';
import { MarketplaceContractEvents } from '@app/blockchain/enums';
import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';

export class NftSaleContract implements IBaseContract {
  contract: IWeb3Contract<NftSaleMethods, NftSaleEvents>;

  blockLimit: number;
  eventBlockNumberCounter: Record<string, number>;
  logger: Logger;

  constructor(
    public address: string,
    public abiFile: string,
    public deploymentTxnHash: string,
    public deploymentBlock: number,
  ) {
    try {
      this.eventBlockNumberCounter = {
        [MarketplaceContractEvents.ALL_EVENTS]: this.deploymentBlock,
      };
    } catch (e) {
      console.log('MarketplaceContractEvents Error', e);
    }
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

  async saleGetSellOrderSeller(orderIndex: number) {
    return await this.contract.methods.getSellOrderSeller(orderIndex).call();
  }

  async saleGetSellOrderExpirationTime(orderIndex: number) {
    return await this.contract.methods
      .getSellOrderExpirationTime(orderIndex)
      .call();
  }

  async saleGetSellOrderPrice(orderIndex: number) {
    return await this.contract.methods.getSellOrderPrice(orderIndex).call();
  }
}
