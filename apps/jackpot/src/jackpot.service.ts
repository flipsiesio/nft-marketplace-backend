import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JackpotStatusEnum, JackpotWatchlistEntity } from './entities/jackpot-watchlist.entity';
import { ContractsConfig } from '@app/config/contracts';
import { Series } from '@app/common/series';
import { CardRandomMinterEntity } from './entities/card-random-minter.entity';
import { JackpotGetIssuedDto } from './dtos/jackpoDtos.dto';
import { RequestService } from '@app/common/request/request.service';
import { TronHeadService } from '@app/common/tronhead';
import { WEB3_PROVIDER } from '@app/blockchain/constants';
import Web3 from 'web3';
import { BlockchainService } from '@app/blockchain';
import { MarketplaceContractEvents } from '@app/blockchain/enums';

export enum GameResultEnum {
  LOSE = 0,
  DRAW = 1,
  WIN = 2,
  JACKPOT = 3,
}

@Injectable()
export class JackpotService {
  //readonly tronWeb: TronWeb;

  public logger = new Logger('JackpotService');

  constructor(
    private tron: TronHeadService,
    // private http: HttpService,
    private requestService: RequestService,
    @InjectRepository(JackpotWatchlistEntity)
    private jackpotWatchlistRepository: Repository<JackpotWatchlistEntity>,
    @InjectRepository(CardRandomMinterEntity)
    private cardRandomMinterRepository: Repository<CardRandomMinterEntity>,
    @Inject(WEB3_PROVIDER) private web3: Web3,
    private blockchainService: BlockchainService,
  ) {
    this.contractRandomMinterEventsListen().then(() => {
      this.getGamesListen(async () => {
        await this.checkingJackpot();
        this.extraditeJackpot();
      }, 1);
    });
  }

  async getTokenId(transactionHash: string) {
    const transaction = await this.web3.eth.getTransactionReceipt(transactionHash)
    const  tokenId = await this.web3.utils.hexToNumber(transaction.logs[0].topics[3]);
    return tokenId.toString();
  }

  async mintFree(count: number, address: string, description: string) { // сминтить nft

    const transaction = await this.blockchainService.mintFreeNft(
      count,
      address,
      description,
    );

    const tokenId = await this.getTokenId(transaction.transactionHash);
    const block = await this.web3.eth.getBlock(transaction.blockNumber);

    return {
      transaction,
      tokenId,
      timestamp: Number(block.timestamp),
    };
  }

  async getGamesListen( // прослушивает игры на наличие джекпота 
    callback: Function = () => {},
    take: number = 100,
    skip?: number,
  ) {
    if (skip === undefined) {
      skip = await this.jackpotWatchlistRepository.count();
    }

    try {
      /*const response: {
        games: Array<{ requestId: string; userAddress: string }>;
        gamesCount: number;
      } = JSON.parse(
        await this.requestService.requestGet(
          `https://provider.flipsies.io/api/v1/game?limit=${take}&offset=${skip}&type=3`,
        ),
      );

      skip += response.games.length;
      response.games.forEach(async game => {
        const jackpot = this.jackpotWatchlistRepository.create({
          requestId: game.requestId,
          userAddress: this.tron.addressFromHex(game.userAddress),
        });
        await this.jackpotWatchlistRepository.save(jackpot);
      });

      if (response.games.length == take) {
        await this.getGamesListen(callback, take, skip);
      }*/

      await callback(skip);

    }catch (e) {
      console.error('getGamesListen error' +e);
    }

    return setTimeout(() => {
      this.getGamesListen(callback, take, skip);
    }, 10000);
  }

  // ... Выдаёт джекпоты
  async extraditeJackpot() {
    const jackpotList = await this.jackpotWatchlistRepository.find({
      where: { status: JackpotStatusEnum.Waiting },
    });

    let count = 0;
    for (const jackpotRecord of jackpotList) {
      try {
        const event = await this.cardRandomMinterRepository.findOne({
          where: { requestId: jackpotRecord.requestId },
        });

        if (event != null) continue;
        const { tokenId, timestamp } = await this.mintFree(
          1,
          jackpotRecord.userAddress,
          jackpotRecord.requestId,
        );

        await this.jackpotWatchlistRepository.update(
          { requestId: jackpotRecord.requestId },
          {
            status: JackpotStatusEnum.Sended,
            tokenId: tokenId,
            mintTimestamp: timestamp,
            amount: event.amount,
          },
        );
        this.logger.log(
          `Jackpot mint ${jackpotRecord.requestId} ${jackpotRecord.userAddress}`,
        );
        count++;
      } catch (err) {
        this.logger.log(err);
        this.logger.log(
          `Fail Jackpot ${jackpotRecord.requestId} ${jackpotRecord.userAddress}`,
        );
        break;
      }
    }

    return count;
  }

  async newJackpot(requestId: string, userAddress: string) {
    const jackpot = this.jackpotWatchlistRepository.create({
      requestId,
      userAddress,
    });
    return this.jackpotWatchlistRepository.save(jackpot);
  }

  // Отмечаем выданные джекпоты в репозитории 'Watchlist' как 'Sended'
  // Не выданные как 'Waiting'
  async checkingJackpot() {
    const jacpkpotListNotVerified = await this.jackpotWatchlistRepository.find({
      where: { status: JackpotStatusEnum.NotVerified },
    });
    for (const jackpotNotVerifiedRecord of jacpkpotListNotVerified) {
      const event = await this.cardRandomMinterRepository.findOne({
        where: { requestId: jackpotNotVerifiedRecord.requestId },
      });
      await this.jackpotWatchlistRepository.update(
        { requestId: jackpotNotVerifiedRecord.requestId },
        {
          status:
            event === null
              ? JackpotStatusEnum.Waiting
              : JackpotStatusEnum.Sended,
        },
      );
    }
  }

  //
  async contractRandomMinterEventsListen() {
    return new Promise(async resolve => {
      const series = new Series();


      const pastEvents = await this.blockchainService.cardRandomMinterContract.getPastEvents(MarketplaceContractEvents.ALL_EVENTS, this.web3);
      const events = pastEvents.map(async event => {
        try {
          const transaction = await this.web3.eth.getTransaction(event.transactionHash);
          const startFunction = transaction.input.substring(0, 10);
          const block = await this.web3.eth.getBlock(transaction.blockNumber);

          if (!event?.returnValues?.desc) return;
          try {
            const record = this.cardRandomMinterRepository.create({
              transaction: event.transactionHash,
              mintTimestamp: Number(block.timestamp),
              userAddress: event.returnValues._to,
              amount: event.returnValues._amount,
              requestId: event.returnValues.desc,
            });
            await this.cardRandomMinterRepository.save(record);
          } catch (error) {
            console.log(
              `Skip transaction: ${
                event.transactionHash
              }; \n\tfull: \n\t(${JSON.stringify(event)})\n`,
            );
          }
        } catch (e) {
          console.log(
            `Skip transaction: ${
              event.transactionHash
            }; \n\tfull: \n\t(${JSON.stringify(event)})\n`,
          );
        }
      });
      resolve(true);
    });
  }

  async getIssued(userAddress: string, dto: JackpotGetIssuedDto) { // возвращает выданные джекпоты 
    const jackportQuery = this.jackpotWatchlistRepository
      .createQueryBuilder('watchlist')
      .orderBy('watchlist.mintTimestamp', 'ASC', 'NULLS FIRST')
      .skip(dto.skip ? Number(dto.skip) : 0);

    if (dto.limit) {
      jackportQuery.take(Number(dto.limit));
    }
    if (dto.issued) {
      const operator = (dto.issued as any as string) === 'true' ? '=' : '!=';
      jackportQuery.andWhere(
        `watchlist.status ${operator} '${JackpotStatusEnum.Sended}'`,
      );
    }
    if (dto.viewed) {
      jackportQuery.andWhere(`watchlist.viewed = ${dto.viewed}`);
    }
    if (dto.requestId) {
      jackportQuery.andWhere(`watchlist.requestId = '${dto.requestId}'`);
    }

    jackportQuery.andWhere(`watchlist.userAddress = '${userAddress}'`);

    const [jackpots, count] = await jackportQuery.getManyAndCount();
    jackpots.forEach(
      jackpot => void (jackpot.mintTimestamp = Number(jackpot.mintTimestamp)),
    );
    return { jackpots, count };
  }

  async postSetViewed(requestId: string) { // помечает что уведомление о джекпоте было просмотренно 
    const record = await this.jackpotWatchlistRepository.findOne({
      where: { requestId },
    });
    if (!record) {
      throw new HttpException(
        `Not found requestId: ${requestId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { viewed } = record;
    if (!viewed) {
      this.jackpotWatchlistRepository.update({ requestId }, { viewed: true });
    }
    return { previousViewed: viewed };
  }
}

