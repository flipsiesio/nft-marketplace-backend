import { ICardMethods } from '@app/blockchain/contracts/card/interfaces/card-method.interface';
import { ICardEvents } from '@app/blockchain/contracts/card/interfaces/card-event.interface';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IBaseContract, IWeb3Contract } from '@app/blockchain/interfaces';
import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';
import { CardContractEvents } from '@app/blockchain/enums';

export class CardContract implements IBaseContract {
  contract: IWeb3Contract<ICardMethods, ICardEvents>;

  blockLimit: number;
  eventBlockNumberCounter: Record<string, number>;
  logger: Logger;

  constructor(public address: string, public abiFile: string,  public deploymentTxnHash: string, public deploymentBlock: number ) {
    this.eventBlockNumberCounter = {
      [CardContractEvents.TRANSFER]: this.deploymentBlock
    };
  }

  async getPastEvents(
    event: CardContractEvents,
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

  async getNftIdList(address: string) {
    try {
      let idList = await this.contract.methods.getNFTListByAddress(address).call();
      console.log(idList)
      return idList.map(idBigNumber => Number(idBigNumber));
    } catch (error) {
      console.log('getNftIdList -> error', error);
      throw new InternalServerErrorException(error, 'getOwnerNftList -> error');
    }
  }

  async getNftUri(tokenId: number) {
    try {
      const tokenUri = await this.contract.methods.tokenURI(tokenId).call();
      return tokenUri;
    } catch (error) {
      console.log('getNftUri -> error', error);
    }
  }

  async mintNft(receiverAddress: string, description: string = '') {
    // const result = await this.cardRandomMinterContract.mintRandomFree(count, address).send(); //TODO then use this method
    const tokenId = Math.round((Math.random() * 10) ^ 6); // TODO get random from DB uint256;
    try {
      return  await this.contract.methods.mint(receiverAddress, tokenId, description)
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('cant mint', error);
    }
  }

  async isUserOwnNft(address: string): Promise<boolean> {
    try {
      const result = await this.contract.methods.balanceOf(address);
      return !!result;
    } catch (error) {
      console.log('balanceOf -> error', error);
      throw new InternalServerErrorException(error, 'balanceOf -> error');
    }
  }

  async estimateGasFee(receiverAddress: string, accountAddress: string, description: string = '') {
      try {
          const tokenId = Math.round((Math.random() * 10) ^ 6);
          return  await this.contract.methods.mint(receiverAddress, tokenId, description).estimateGas({ from: accountAddress });
      } catch (error) {
          console.log(error);
          throw new InternalServerErrorException('cant estimate transaction', error);
      }
  }

}
