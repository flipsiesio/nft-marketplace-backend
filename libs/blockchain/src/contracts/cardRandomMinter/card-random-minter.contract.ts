import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IBaseContract, IWeb3Contract } from '@app/blockchain/interfaces';
import { ICardRandomMinterMethods } from '@app/blockchain/contracts/cardRandomMinter/interfaces/card-random-minter-method.interface';
import { ICardRandomMinterEvents } from '@app/blockchain/contracts/cardRandomMinter/interfaces/card-random-minter-event.interface';
import { MarketplaceContractEvents } from '@app/blockchain/enums';
import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';

export class CardRandomMinterContract implements IBaseContract {
  contract: IWeb3Contract<ICardRandomMinterMethods, ICardRandomMinterEvents>;

  blockLimit: number;
  eventBlockNumberCounter: Record<string, number>;
  logger: Logger;

  constructor(public address: string, public abiFile: string,  public deploymentTxnHash: string, public deploymentBlock: number ) {
    this.eventBlockNumberCounter = {
      [MarketplaceContractEvents.ALL_EVENTS]: this.deploymentBlock
    };
  }

  async getPastEvents(
    event: MarketplaceContractEvents,
    web3: Web3
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

  async mintFreeNft(
    count: number,
    receiverAddress: string,
    description: string = '',
  ) {
    // const result = await this.cardRandomMinterContract.mintRandomFree(count, address).send(); //TODO then use this method
    try {
      return  this.contract.methods
        .mintRandomFree(count, receiverAddress, description).encodeABI();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('cant mint', error);
    }
  }

  async estimateGasFee(
      count: number,
      receiverAddress: string,
      accountAddress: string,
      description: string = '',
  ) {
      try {
          return  await this.contract.methods
              .mintRandomFree(count, receiverAddress, description).estimateGas({ from: accountAddress });
      } catch (error) {
          console.log(error);
          throw new InternalServerErrorException('cant estimate transaction', error);
      }
  }

}
