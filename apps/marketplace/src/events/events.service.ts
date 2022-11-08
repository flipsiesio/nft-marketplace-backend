import { Series } from '@app/common/series';
import { TronHeadService } from '@app/common/tronhead';
import { ContractsConfig } from '@app/config/contracts';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, Not, Repository } from 'typeorm';
import { OrderType } from '../marketplace/order-type.enums';
import { CardEntity } from './entities/card.entity';
import { EventsBidEntity } from './entities/events-bid.entity';
import { EventsSaleEntity } from './entities/events-sale.entity';
import { MintEntity } from './entities/mint.entity';
import { ParamBid, ParamSale } from './entities/param.type';
import { SaleAndMintEntity } from './entities/sale-and-mint.entity';
import { StateBidEntity } from './entities/state-bid.entity';
import { StateSaleEntity } from './entities/state-sale.entity';
import { BidEventEnum } from './enums/bid-event.enum';
import { SaleEventEnum } from './enums/sale-event.enum';
import { BlockchainService } from '@app/blockchain';
import {
  CardContractEvents,
  MarketplaceContractEvents,
} from '@app/blockchain/enums';
import Web3 from 'web3';
import { WEB3_PROVIDER } from '@app/blockchain/constants';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { EventNameEnum } from './../enums/event-name.enum';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name, {
    timestamp: true,
  });
  currentTimestamp: number = 0;

  constructor(
    private tron: TronHeadService,
    @InjectRepository(EventsBidEntity)
    private eventsBidRepository: Repository<EventsBidEntity>,
    @InjectRepository(StateBidEntity)
    private stateBidRepository: Repository<StateBidEntity>,
    @InjectRepository(EventsSaleEntity)
    private eventsSaleRepository: Repository<EventsSaleEntity>,
    @InjectRepository(StateSaleEntity)
    private stateSaleRepository: Repository<StateSaleEntity>,
    @InjectRepository(MintEntity)
    private MintRepository: Repository<MintEntity>,
    @InjectRepository(SaleAndMintEntity)
    private saleAndMintRepository: Repository<SaleAndMintEntity>,
    @InjectRepository(CardEntity)
    private cardRepositoryTypeorm: Repository<CardEntity>,
    @Inject(WEB3_PROVIDER) private web3: Web3,
    private blockchainService: BlockchainService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async start() {
    // старт всего
    await this.getCurrentTimestamp();

    //this.eventsMintListen();
    //this.eventsBidListen();
    //this.eventsSaleListen();

    this.getActualOrderBidListen();
    this.getActualOrderSaleListen();

    this.getOrderSaleActiveStartListen();
    this.getOrderBidsActiveStartListen();

    setInterval(() => {
      this.getCurrentTimestamp();
    }, 7000);
  }

  async getCurrentTimestamp() {
    // актуальное время
    try {
      const latestBlock = await this.web3.eth.getBlockNumber();
      const currentBlock = await this.web3.eth.getBlock(latestBlock);
      this.currentTimestamp = Number(currentBlock.timestamp);
      return this.currentTimestamp;
    } catch (e) {
      console.log('getCurrentTimestamp', e);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: 'BidEvents' })
  async bttcEventsBidListen() {
    // прослушивает евенты CONTRACT_NFT_MARKETPLACE и записывает их в бд eventsBidRepository
    const job = this.schedulerRegistry.getCronJob('BidEvents');

    job.stop();
    try {
      const pastEvents =
        await this.blockchainService.marketplaceContract.getPastEvents(
          MarketplaceContractEvents.ALL_EVENTS,
          this.web3,
        );

      pastEvents.map(async event => {
        const transaction = await this.web3.eth.getTransaction(
          event.transactionHash,
        );

        const startFunction = transaction.input.substring(0, 10);
        const block = await this.web3.eth.getBlock(transaction.blockNumber);

        let buyer = null;

        if (event.returnValues.buyer) {
          buyer = String(event.returnValues.buyer);
        }
        if (
          event.event === BidEventEnum.OrderCreated ||
          event.event === BidEventEnum.OrderRejected ||
          event.event === BidEventEnum.OrderFilled
        ) {
          try {
            const seller =
              await this.blockchainService.marketplaceContract.marketplaceGetSellOrderSeller(
                Number(event.returnValues.orderIndex),
              );
            const expirationTime =
              await this.blockchainService.marketplaceContract.marketplaceGetSellOrderExpirationTime(
                Number(event.returnValues.orderIndex),
              );
            let createOrderDB = await this.eventsBidRepository.findOneBy({
              name: BidEventEnum.OrderCreated,
              orderIndex: event.returnValues.orderIndex,
            });

            let createdIdToken = null;

            if (createOrderDB) {
              createdIdToken = createOrderDB.tokenId;
            }

            if (!createdIdToken) {
              const createOrder = pastEvents.find(ev => {
                return (
                  ev.event === BidEventEnum.OrderCreated &&
                  ev.returnValues.orderIndex === event.returnValues.orderIndex
                );
              });
              createdIdToken = createOrder.returnValues.tokenId;
            }

            const param: ParamBid = {
              block: transaction.blockNumber,
              timestamp: Number(block.timestamp),
              contract: this.blockchainService.marketplaceContract.address,
              name: event.event,
              transaction: event.transactionHash,
              orderIndex: Number(event.returnValues.orderIndex),
              seller,
              expirationTime,
              buyer,
              tokenId: event.returnValues.tokenId
                ? Number(event.returnValues.tokenId)
                : null,
            };

            if (!createdIdToken) {
              createdIdToken = Number(event.returnValues.tokenId);
              param.createdTokenId = createdIdToken;
            } else {
              createdIdToken = Number(createdIdToken);
              param.createdTokenId = createdIdToken;
            }

            const checkTransaction = await this.eventsBidRepository.findOne({
              where: { transaction: event.transactionHash },
            });

            if (!checkTransaction) {
              const eventsTrade = this.eventsBidRepository.create(
                param as EventsBidEntity,
              );
              await this.eventsBidRepository.save(eventsTrade);
            }

            const eventsMint = this.saleAndMintRepository.create({
              ...param,
              tableId: 'eventsBid',
            });
            await this.saleAndMintRepository.save(eventsMint);

            if (event.event === BidEventEnum.OrderFilled) {
              // console.log(
              //   'BID',
              //   event.returnValues.buyer,
              //   event.returnValues.buyer,
              //   event,
              //   createdIdToken,
              // );
              // await this.cardRepositoryTypeorm.update(
              //   { cardId: createdIdToken },
              //   { ownerAddress: event.returnValues.buyer },
              // );
            }
          } catch (e) {
            console.log('eventsBidListenERRORCreated', e);
            console.log(
              `Skip event bid "${event.event}" ${event.transactionHash} ${event.returnValues.orderIndex}`,
            );
          }
        }

        if (
          event.event === BidEventEnum.Bid ||
          event.event === BidEventEnum.BidCancelled
        ) {
          try {
            const createOrderDB = await this.eventsBidRepository.findOne({
              where: {
                name: BidEventEnum.OrderCreated,
                orderIndex: Number(event.returnValues.orderIndex),
              },
            });
            let tokenId = null;

            if (createOrderDB) {
              tokenId = createOrderDB.tokenId;
            }

            if (!tokenId) {
              const createOrder = pastEvents.find(ev => {
                return (
                  ev.event === BidEventEnum.OrderCreated &&
                  ev.returnValues.orderIndex === event.returnValues.orderIndex
                );
              });
              tokenId = createOrder.returnValues.tokenId;
            }

            const param = {
              block: event.blockNumber,
              timestamp: Number(block.timestamp),
              contract: this.blockchainService.marketplaceContract.address,
              name: event.event,
              transaction: event.transactionHash,
              orderIndex: Number(event.returnValues.orderIndex),
              tokenId,
              createdTokenId: tokenId,
              amount: event?.returnValues?.added ?? event?.returnValues?.amount,
              buyer,
              total: event.returnValues.total,
            };

            const checkTransaction = await this.eventsBidRepository.findOne({
              where: { transaction: event.transactionHash },
            });

            if (!checkTransaction) {
              const eventsBid = this.eventsBidRepository.create(param);
              await this.eventsBidRepository.save(eventsBid);

              const eventsMint = this.saleAndMintRepository.create({
                ...param,
                tableId: 'eventsBid',
              });
              await this.saleAndMintRepository.save(eventsMint);
            }
          } catch (e) {
            console.log(
              `Skip bid transaction "${event.event}" ${event.transactionHash} ${event.returnValues.orderIndex}`,
            );
            console.log('Skip bid transaction', e);
          }
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      job.start();
    }
  }

  /*async eventsBidListen() { // прослушивает евенты CONTRACT_NFT_MARKETPLACE и записывает их в бд eventsBidRepository
    const series = new Series();

    this.tron.eventsListen(ContractsConfig.CONTRACT_NFT_MARKETPLACE, events => {
      series.push(...events).process(async event => {
        console.log(
          'eventsBidListen',
          `"${event.name}" ${event.transaction} ${event.result.orderIndex}`,
        );
        if (
          event.name == BidEventEnum.OrderCreated ||
          event.name == BidEventEnum.OrderRejected ||
          event.name == BidEventEnum.OrderFilled
        ) {
          try {
            const seller =
              await this.tron.contracts.marketplace.marketplaceGetSellOrderSeller(
                Number(event.result.orderIndex),
              );
            const expirationTime =
              await this.tron.contracts.marketplace.marketplaceGetSellOrderExpirationTime(
                Number(event.result.orderIndex),
              );

            const createdTokenId = await this.eventsBidRepository.findOneBy({
              name: BidEventEnum.OrderCreated,
              orderIndex: event.result.orderIndex,
            });

            const param: ParamBid = {
              block: event.block,
              timestamp: event.timestamp,
              contract: event.contract,
              name: event.name,
              transaction: event.transaction,
              orderIndex: Number(event.result.orderIndex),
              seller,
              expirationTime,
              buyer: this.tron.addressFromHex(event?.result?.buyer),
              tokenId: event.result.tokenId
                ? Number(event.result.tokenId)
                : null,
            };

            if (createdTokenId == null || createdTokenId == undefined) {
              const createdIdToken = Number(event.result.tokenId);
              param.createdTokenId = createdIdToken;
            } else {
              const createdIdToken = Number(createdTokenId.tokenId);
              param.createdTokenId = createdIdToken;
            }

            const eventsTrade = this.eventsBidRepository.create(param as EventsBidEntity);
            await this.eventsBidRepository.save(eventsTrade);

            const eventsMint = this.saleAndMintRepository.create({
              ...param,
              tableId: 'eventsBid',
            });
            await this.saleAndMintRepository.save(eventsMint);

            if (event.name == BidEventEnum.OrderFilled) {
              console.log('BID', this.tron.addressFromHex(event?.result?.buyer), event.result.buyer, event, createdTokenId.tokenId);
              await this.cardRepositoryTypeorm.update(
                { cardId: createdTokenId.tokenId },
                { ownerAddress: this.tron.addressFromHex(event?.result?.buyer) },
              );
            }
          } catch (e) {
            console.log('eventsBidListenERRORCreated', e);
            console.log(
              `Skip event bid "${event.name}" ${event.transaction} ${event.result.orderIndex}`,
            );
          }
        }

        if (
          event.name == BidEventEnum.Bid ||
          event.name == BidEventEnum.BidCancelled
        ) {
          try {
            const tokenId = (
              await this.eventsBidRepository.findOne({
                where: {
                  name: BidEventEnum.OrderCreated,
                  orderIndex: Number(event.result.orderIndex),
                },
              })
            ).tokenId;

            const param = {
              block: event.block,
              timestamp: event.timestamp,
              contract: event.contract,
              name: event.name,
              transaction: event.transaction,
              orderIndex: Number(event.result.orderIndex),
              tokenId,
              createdTokenId: tokenId,
              amount: event?.result?.added ?? event?.result?.amount,
              buyer: this.tron.addressFromHex(event.result.buyer),
              total: event.result.total,
            };

            const eventsBid = this.eventsBidRepository.create(param);
            await this.eventsBidRepository.save(eventsBid);

            const eventsMint = this.saleAndMintRepository.create({
              ...param,
              tableId: 'eventsBid',
            });
            await this.saleAndMintRepository.save(eventsMint);

          } catch (e) {
            console.log(
              `Skip transaction "${event.name}" ${event.transaction} ${event.result.orderIndex}`,
            );
            console.log('Skip transaction', e);
          }
        }
      });
    });
  }*/
  @Cron(CronExpression.EVERY_30_SECONDS, { name: 'SaleEvents' })
  async btcSaleListen() {
    const job = this.schedulerRegistry.getCronJob('SaleEvents');

    job.stop();
    try {
      const pastEvents =
        await this.blockchainService.nftSaleContract.getPastEvents(
          MarketplaceContractEvents.ALL_EVENTS,
          this.web3,
        );

      const events = pastEvents.map(async event => {
        const transaction = await this.web3.eth.getTransaction(
          event.transactionHash,
        );
        const block = await this.web3.eth.getBlock(transaction.blockNumber);

        this.logger.log(
          `eventsSaleListen ${event.event} ${event.transactionHash} ${event.returnValues.orderIndex}`,
        );
        try {
          let buyer = null;

          if (event.returnValues.buyer) {
            buyer = String(event.returnValues.buyer);
          }
          const seller =
            await this.blockchainService.nftSaleContract.saleGetSellOrderSeller(
              Number(event.returnValues.orderIndex),
            );
          const price =
            await this.blockchainService.nftSaleContract.saleGetSellOrderPrice(
              Number(event.returnValues.orderIndex),
            );
          const expirationTime =
            await this.blockchainService.nftSaleContract.saleGetSellOrderExpirationTime(
              Number(event.returnValues.orderIndex),
            );

          let createOrderDB = await this.eventsSaleRepository.findOneBy({
            name: SaleEventEnum.OrderCreated,
            orderIndex: event.returnValues.orderIndex,
          });

          let createdIdToken = null;

          if (createOrderDB) {
            createdIdToken = createOrderDB.tokenId;
          }

          if (!createdIdToken) {
            const createOrder = pastEvents.find(ev => {
              return (
                ev.event === BidEventEnum.OrderCreated &&
                ev.returnValues.orderIndex === event.returnValues.orderIndex
              );
            });
            createdIdToken = createOrder.returnValues.tokenId;
          }

          const param: ParamSale = {
            block: transaction.blockNumber,
            timestamp: Number(block.timestamp),
            contract: this.blockchainService.nftSaleContract.address,
            name: event.event,
            transaction: event.transactionHash,
            orderIndex: Number(event.returnValues.orderIndex),
            seller,
            buyer,
            price: BigInt(price).toString(),
            expirationTime,
            tokenId: event.returnValues.tokenId
              ? Number(event.returnValues.tokenId)
              : null,
          };

          if (!createdIdToken) {
            createdIdToken = Number(event.returnValues.tokenId);
            param.createdTokenId = createdIdToken;
          } else {
            createdIdToken = Number(createdIdToken);
            param.createdTokenId = createdIdToken;
          }

          const checkTransaction = await this.eventsSaleRepository.findOne({
            where: { transaction: event.transactionHash },
          });

          if (!checkTransaction) {
            const eventsTrade = this.eventsSaleRepository.create(
              param as EventsSaleEntity,
            );
            await this.eventsSaleRepository.save(eventsTrade);
          }

          const saleGeneral = this.saleAndMintRepository.create({
            ...param,
            tableId: 'eventsSale',
          });
          await this.saleAndMintRepository.save(saleGeneral);

          if (event.event == SaleEventEnum.OrderFilled) {
            // console.log('SALE', this.tron.addressFromHex(event?.result?.buyer), event.result.buyer, event, createdTokenId.tokenId);
            // await this.cardRepositoryTypeorm.update(
            //   { cardId: createdIdToken },
            //   { ownerAddress: buyer },
            // );
          }
        } catch (e) {
          console.log(
            `Skip event sale "${event.event}" ${event.transactionHash} ${event.returnValues.orderIndex}`,
          );
          console.log('Skip event sale', e);
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      job.start();
    }
  }

  /*async eventsSaleListen() { // прослушивает евенты CONTRACT_NFT_SALE и записывает их в бд eventsSaleRepository
    const series = new Series();

    this.tron.eventsListen(
      ContractsConfig.CONTRACT_NFT_SALE,
      (events) => {
        series.push(...events).process(async event => {
          console.log(
            'eventsSaleListen',
            `"${event.name}" ${event.transaction} ${event.result.orderIndex}`,
          );
          try {
            const seller =
              await this.tron.contracts.sale.saleGetSellOrderSeller(
                Number(event.result.orderIndex),
              );
            const price = await this.tron.contracts.sale.saleGetSellOrderPrice(
              Number(event.result.orderIndex),
            );
            const expirationTime =
              await this.tron.contracts.sale.saleGetSellOrderExpirationTime(
                Number(event.result.orderIndex),
              );
            const createdTokenId = await this.eventsSaleRepository.findOneBy({
              name: SaleEventEnum.OrderCreated,
              orderIndex: event.result.orderIndex,
            });

            const param: ParamSale = {
              block: event.block,
              timestamp: event.timestamp,
              contract: event.contract,
              name: event.name,
              transaction: event.transaction,
              orderIndex: Number(event.result.orderIndex),
              seller,
              buyer: this.tron.addressFromHex(event?.result?.buyer),
              price: BigInt(price).toString(),
              expirationTime,
              tokenId: event.result.tokenId
                ? Number(event.result.tokenId)
                : null,
            };

            if (createdTokenId == null || createdTokenId == undefined) {
              const createdIdToken = Number(event.result.tokenId);
              param.createdTokenId = createdIdToken;
            } else {
              const createdIdToken = Number(createdTokenId.tokenId);
              param.createdTokenId = createdIdToken;
            }

            const eventsTrade = this.eventsSaleRepository.create(param as EventsSaleEntity);
            await this.eventsSaleRepository.save(eventsTrade);

            const saleGeneral = this.saleAndMintRepository.create({
              ...param,
              tableId: 'eventsSale',
            });
            await this.saleAndMintRepository.save(saleGeneral);

            if (event.name == SaleEventEnum.OrderFilled) {
              // console.log('SALE', this.tron.addressFromHex(event?.result?.buyer), event.result.buyer, event, createdTokenId.tokenId);
              await this.cardRepositoryTypeorm.update(
                { cardId: createdTokenId.tokenId },
                { ownerAddress: this.tron.addressFromHex(event?.result?.buyer) },
              );
            }

          } catch (e) {
            console.log(
              `Skip event sale "${event.name}" ${event.transaction} ${event.result.orderIndex}`,
            );
            console.log('Skip event sale', e);
          }
        });
      },
    );
  }*/

  async getSaleHistory(
    // возвращает историю евентов CONTRACT_NFT_SALE из бд eventsSaleRepository
    byOrder: boolean,
    ids: number[],
    skip: number = 0,
    take: number = 100,
    count: boolean = false,
    active?: boolean,
    order: OrderType = OrderType.ASC,
  ) {
    const query = this.eventsSaleRepository.createQueryBuilder('saleHistory');
    const columns = [
      'saleHistory.id',
      'saleHistory.createdAt',
      'saleHistory.updatedAt',
      'saleHistory.block',
      'saleHistory.timestamp',
      'saleHistory.contract',
      'saleHistory.name',
      'saleHistory.transaction',
      'saleHistory.orderIndex',
      'saleHistory.seller',
      'saleHistory.price',
      'saleHistory.tokenId',
      'saleHistory.createdTokenId',
      'saleHistory.expirationTime',
    ];

    query.select(columns);

    const where: {
      name?: FindOperator<any>;
      createdTokenId?: FindOperator<any>;
      active?: boolean;
      orderIndex?: FindOperator<any>;
    } = {};
    const names = [
      SaleEventEnum.OrderCreated,
      SaleEventEnum.OrderFilled,
      SaleEventEnum.OrderRejected,
    ];

    where.name = In(names);

    if (ids?.length > 0) {
      if (byOrder) {
        where.orderIndex = In(ids);
      } else {
        where.createdTokenId = In(ids);
      }
    }
    query.where(where);
    query.orderBy('saleHistory.timestamp', order ? order : 'ASC');

    query.leftJoinAndMapOne(
      'saleHistory.state_sales',
      StateSaleEntity,
      'sales',
      'saleHistory.createdTokenId = sales.tokenId',
    );
    if (active != undefined) {
      query.andWhere(`sales.active = '${active}'`);
    }

    if (take) query.limit(take);
    if (skip) query.offset(skip);

    if (count) {
      return query.getCount();
    } else {
      return query.getMany();
    }
  }

  async getSaleAndMintHistory(
    // возвращает события из бд saleAndMintRepository
    byOrder: boolean,
    ids: number[],
    skip = 0,
    take = 100,
    order: OrderType = OrderType.ASC,
    watchBids: string = 'true',
    count: boolean = false,
  ) {
    const query = this.saleAndMintRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .orderBy('timestamp', order);

    if (watchBids == 'true') {
      (EventNameEnum as any).bid = 'Bid';
    }

    query.where({ name: In(Object.values(EventNameEnum)) });

    if (byOrder !== undefined) {
      if (byOrder) {
        query.andWhere({ orderIndex: In(ids) });
      } else {
        query.andWhere({ createdTokenId: In(ids) });
      }
    }
    if (count == true) {
      return query.getCount();
    }
    return query.getMany();
  }

  async getBidHistory(
    // возвращает историю евентов CONTRACT_NFT_MARKETPLACE из бд eventsBidRepository
    byOrder: boolean,
    ids: number[],
    skip: number = 0,
    take: number = 100,
    count: boolean = false,
    names?: string[],
    active?: boolean,
    order: OrderType = OrderType.ASC,
  ) {
    const query = this.eventsBidRepository.createQueryBuilder('bidHistory');
    const columns = [
      'bidHistory.id',
      'bidHistory.createdAt',
      'bidHistory.updatedAt',
      'bidHistory.block',
      'bidHistory.timestamp',
      'bidHistory.contract',
      'bidHistory.name',
      'bidHistory.transaction',
      'bidHistory.orderIndex',
      'bidHistory.seller',
      'bidHistory.tokenId',
      'bidHistory.createdTokenId',
      'bidHistory.expirationTime',
      'bidHistory.buyer',
      'bidHistory.amount',
    ];

    query.select(columns);

    const where: {
      name?: FindOperator<any>;
      createdTokenId?: FindOperator<any>;
      active?: boolean;
      orderIndex?: FindOperator<any>;
    } = {};

    if (names?.length == 0) {
      names = [
        BidEventEnum.OrderCreated,
        BidEventEnum.OrderFilled,
        BidEventEnum.OrderRejected,
        BidEventEnum.Bid,
        BidEventEnum.BidCancelled,
      ];
    } else if (Array.isArray(names)) {
      const keys = Object.keys(BidEventEnum);
      names.forEach(name => {
        if (keys.includes(name)) {
          where.name = In(names);
        }
      });
    }

    if (ids?.length > 0) {
      if (byOrder) {
        where.orderIndex = In(ids);
      } else {
        where.createdTokenId = In(ids);
      }
    }

    query.where(where);
    query.orderBy('bidHistory.timestamp', order ? order : 'ASC');

    query.leftJoinAndMapOne(
      'bidHistory.state_bids',
      StateBidEntity,
      'bids',
      'bidHistory.createdTokenId = bids.tokenId',
    );
    if (active != undefined) {
      query.andWhere(`bids.active = '${active}'`);
    }

    if (take) query.limit(take);
    if (skip) query.offset(skip);

    if (count) {
      return query.getCount();
    } else {
      return query.getMany();
    }
  }

  async getRecordsRepositoryListen(
    // прослушивает репозиторий, возвращает записи из репозитория
    repository: Repository<any>,
    callback: Function,
    take: number = 1,
    skip: number = 0,
    timeout = 7000,
  ) {
    const takeRecords = async () => {
      const records = await repository.find({
        take,
        skip,
        order: { id: 'ASC' },
      });
      console.log('>>>>>>\n', repository.metadata.name, skip, '\n <<<<<');
      if (records.length > 0) {
        skip += records.length;
        callback(records);
      }
      if (records.length == take) {
        await takeRecords();
      }
    };

    await takeRecords();

    (function ftimeout() {
      setTimeout(async () => {
        await takeRecords();
        ftimeout();
      }, timeout);
    })();

    // return setInterval(async () => {
    //   await takeRecords();
    // }, timeout);
  }

  async getActualOrderBidListen() {
    // прослушивает записи из eventsBidRepository и записывает их в stateBidRepository для формирования таблицы актуальных ставок
    const update = async (record: EventsBidEntity) => {
      // console.log(
      //   'getActualOrderBidListen',
      //   record.name,
      //   record.transaction,
      //   record.orderIndex,
      // );
      if (!record) {
        console.log('Empty bid');
        return;
      }
      try {
        if (record.name == BidEventEnum.OrderCreated) {
          if (
            (await this.stateBidRepository.findOneBy({
              orderIndex: record.orderIndex,
            })) == null
          ) {
            const recordState: StateBidEntity = this.stateBidRepository.create({
              transaction: record.transaction,
              orderIndex: record.orderIndex,
              seller: record.seller,
              tokenId: record.tokenId,
              createdTokenId: record.tokenId,
              timestamp: record.timestamp,
              expirationTime: record.expirationTime,
              active: this.currentTimestamp < record.expirationTime,
              bids: {},
            });
            const stateRecordBid = await this.stateBidRepository.save(
              recordState,
            );

            if (stateRecordBid) {
              this.getOrderBidsActiveListen(stateRecordBid);
            }
          }
        } else if (
          record.name == BidEventEnum.OrderRejected ||
          record.name == BidEventEnum.OrderFilled
        ) {
          const state = await this.stateBidRepository.findOneBy({
            orderIndex: record.orderIndex,
          });

          if (!state) return;

          if (record.name == BidEventEnum.OrderFilled) {
            delete state.bids[record.buyer.toLowerCase()];
          }

          if (Object.keys(state.bids).length == 0) {
            await this.stateBidRepository.delete({
              orderIndex: record.orderIndex,
            });
          } else {
            const bidsSum = Object.values(state.bids).reduce((sum, bid) => {
              return sum + BigInt(bid.price);
            }, 0n);
            //console.log('record', record);

            await this.stateBidRepository.update(
              { orderIndex: record.orderIndex },
              {
                tokenId: null,
                active: false,
                bids: state.bids,
                bidsSum: bidsSum.toString(),
              },
            );
          }
        } else if (record.name == BidEventEnum.Bid) {
          const state = await this.stateBidRepository.findOneBy({
            orderIndex: record.orderIndex,
          });
          //console.log(state);
          if (!state) return;

          state.bids[record.buyer.toLowerCase()] = {
            transaction: record.transaction,
            buyer: record.buyer.toLowerCase(),
            timestamp: record.timestamp,
            price: BigInt(record.total).toString(),
          };
          const bidsSum = Object.values(state.bids).reduce((sum, bid) => {
            return sum + BigInt(bid.price);
          }, 0n);

          await this.stateBidRepository.update(
            { orderIndex: record.orderIndex },
            {
              bids: state.bids,
              bidsSum: bidsSum.toString(),
            },
          );
        } else if (record.name == BidEventEnum.BidCancelled) {
          const state = await this.stateBidRepository.findOneBy({
            orderIndex: record.orderIndex,
          });

          if (!state) return;

          delete state.bids[record.buyer.toLowerCase()];

          const bidsSum = Object.values(state.bids).reduce((sum, bid) => {
            return sum + BigInt(bid.price);
          }, 0n);

          if (Object.keys(state.bids).length == 0 && state.tokenId == null) {
            await this.stateBidRepository.delete({
              orderIndex: record.orderIndex,
            });
          } else {
            await this.stateBidRepository.update(
              { orderIndex: record.orderIndex },
              {
                bids: state.bids,
                bidsSum: bidsSum.toString(),
              },
            );
          }
        }
      } catch (e) {
        console.log(
          'stateBidError',
          `${record.name}, ${record.transaction}, ${record.orderIndex}`,
        );
        console.log('stateBidError', e);
      }
    };

    const series = new Series(update);

    this.getRecordsRepositoryListen(
      this.eventsBidRepository,
      records => {
        series.push(...records).process();
      },
      100,
      0,
      5000,
    );
  }

  async getActualOrderSaleListen() {
    // прослушивает записи из eventsSaleRepository и записывает их в stateSaleRepository для формирования таблицы актуальных ставок
    const update = async (record: EventsSaleEntity) => {
      // console.log(
      //   'getActualOrderSaleListen',
      //   record.name,
      //   record.transaction,
      //   record.orderIndex,
      // );
      if (!record) {
        console.log('Empty sale');
        return;
      }
      try {
        if (record.name == SaleEventEnum.OrderCreated) {
          if (
            (await this.stateSaleRepository.findOneBy({
              orderIndex: record.orderIndex,
            })) == null
          ) {
            const recordState: StateSaleEntity =
              this.stateSaleRepository.create({
                transaction: record.transaction,
                orderIndex: record.orderIndex,
                seller: record.seller,
                tokenId: record.tokenId,
                createdTokenId: record.tokenId,
                timestamp: record.timestamp,
                price: record.price,
                expirationTime: record.expirationTime,
                active: this.currentTimestamp < record.expirationTime,
              });
            const stateRecordSale = await this.stateSaleRepository.save(
              recordState,
            );

            if (stateRecordSale) {
              this.getOrderSaleActiveListen(stateRecordSale);
            }
          }
        } else if (
          record.name == SaleEventEnum.OrderRejected ||
          record.name == SaleEventEnum.OrderFilled
        ) {
          await this.stateSaleRepository.delete({
            orderIndex: record.orderIndex,
          });
        }
      } catch (e) {
        console.log(
          'stateSaleError',
          `${record.name}, ${record.transaction}, ${record.orderIndex}`,
        );
        console.log('stateSaleError', e);
      }
    };

    const series = new Series(update);

    this.getRecordsRepositoryListen(
      this.eventsSaleRepository,
      records => {
        console.log(
          '>>>\n new in getActualOrderSaleListen\n',
          records,
          '\n<<<',
        );
        series.push(...records).process();
      },
      100,
      0,
      5000,
    );
  }

  async getActualOrderSale(
    // возвращает актуальные продажи NFT_SALE из бд stateSaleRepository
    byOrder?: boolean,
    ids: number[] = [],
    seller?: string,
    active?: boolean,
    take: number = 100,
    skip: number = 0,
    order?: OrderType,
    count: boolean = false,
  ) {
    const query = this.stateSaleRepository.createQueryBuilder('sale');
    const columns = [
      'sale.id',
      'sale.transaction',
      'sale.orderIndex',
      'sale.seller',
      'sale.tokenId',
      'sale.createdTokenId',
      'sale.active',
      'sale.price',
    ];
    query.select(columns);

    const where: {
      createdTokenId?: FindOperator<any>;
      seller?: string;
      active?: boolean;
      orderIndex?: FindOperator<any>;
    } = {};

    if (byOrder == true) {
      if (ids?.length > 0) {
        where.orderIndex = In(ids);
      }
    } else {
      if (ids?.length > 0) {
        where.createdTokenId = In(ids);
      }
    }

    if (seller) {
      where.seller = seller;
    }

    if (active != undefined) {
      where.active = active;
    }

    query.where(where);
    query.orderBy('sale.id', 'ASC', 'NULLS LAST');
    if (order) {
      query.orderBy(
        'sale.price',
        order == 'DESC' ? order : 'ASC',
        'NULLS LAST',
      );
    }

    if (take) query.limit(take);
    if (skip) query.offset(skip);

    if (count) {
      return query.getCount();
    } else {
      if (ids.length == 0 || ids.length > 1) {
        return query.getMany();
      } else {
        return query.getOne();
      }
    }
  }

  async getActualOrderBids(
    // возвращает актуальные ставки NFT_MARKETPLACE из бд stateBidRepository
    byOrder?: boolean,
    ids: number[] = [],
    seller?: string,
    active?: boolean,
    take: number = 100,
    skip: number = 0,
    order?: OrderType,
    count: boolean = false,
  ) {
    const query = this.stateBidRepository.createQueryBuilder('bid');

    const columns = [
      'bid.id',
      'bid.transaction',
      'bid.orderIndex',
      'bid.seller',
      'bid.tokenId',
      'bid.createdTokenId',
      'bid.active',
      'bid.bids',
      'bid.bidsSum',
    ];
    query.select(columns);

    const where: {
      createdTokenId?: FindOperator<any>;
      seller?: string;
      active?: boolean;
      orderIndex?: FindOperator<any>;
    } = {};

    if (byOrder == true) {
      if (ids?.length > 0) {
        where.orderIndex = In(ids);
      }
    } else {
      if (ids?.length > 0) {
        where.createdTokenId = In(ids);
      }
    }

    if (seller) {
      where.seller = seller;
    }

    if (active != undefined) {
      where.active = active;
    }

    query.where(where);
    query.orderBy('bid.id', 'ASC', 'NULLS LAST');
    if (order) {
      query.orderBy(
        'bid.bidsSum',
        order == 'DESC' ? order : 'ASC',
        'NULLS LAST',
      );
    }

    if (take) query.limit(take);
    if (skip) query.offset(skip);

    if (count) {
      return query.getCount();
    } else {
      if (ids.length == 0 || ids.length > 1) {
        return query.getMany();
      } else {
        return query.getOne();
      }
    }
  }

  async getActualSaleOrderBySeller(
    // возвращает актуальные продажи по адрессу продавца
    addressSeller?: string,
    tokenIsNull = false,
  ) {
    const query = this.stateSaleRepository.createQueryBuilder('sale');

    if (addressSeller) {
      query.andWhere(`sale.seller = '${addressSeller}'`);
    }

    if (tokenIsNull != undefined) {
      query.andWhere(
        `sale.tokenId IS ${tokenIsNull == false ? 'NOT' : ''} NULL`,
      );
    }

    return query.getMany();
  }

  async getActualBidOrderBySeller(addressSeller: string, tokenIsNull = false) {
    // возвращает актуальные ставки по адрессу продавца
    const query = this.stateBidRepository.createQueryBuilder('bid');

    if (addressSeller) {
      query.andWhere(`bid.seller = '${addressSeller}'`);
    }

    if (tokenIsNull != undefined) {
      query.andWhere(
        `bid.tokenId IS ${tokenIsNull == false ? 'NOT' : ''} NULL`,
      );
    }

    return query.getMany();
  }

  async getOrderSaleIsActive(orderIndex: number) {
    // проверяет актуальность ордера продажи
    const order = await this.stateSaleRepository.findOne({
      where: { orderIndex },
    });

    if (!order) return null; //throw new HttpException('Order sale not found', HttpStatus.NOT_FOUND);
    const actual = (await this.getCurrentTimestamp()) < order.expirationTime;

    if (!actual) {
      await this.stateSaleRepository.delete({ orderIndex });
    }

    if (order.active != actual) {
      await this.stateSaleRepository.update({ orderIndex }, { active: actual });
    }

    return actual;
  }

  async getOrderBidsIsActive(orderIndex: number) {
    // проверяет актуальность ордера ставки
    const order = await this.stateBidRepository.findOne({
      where: { orderIndex },
    });

    if (!order) return null; //throw new HttpException('Order bid not found', HttpStatus.NOT_FOUND);
    const actual = (await this.getCurrentTimestamp()) < order.expirationTime;

    if (order.active != actual) {
      await this.stateBidRepository.update({ orderIndex }, { active: actual });
    }

    return actual;
  }

  async getOrderSaleActiveListen(recordSale: StateSaleEntity) {
    // устанавливает будильник на ордер продажи для проверки активности
    if (recordSale.active == true) {
      function checkSaleActive() {
        let timeout = recordSale.expirationTime - this.currentTimestamp + 7;
        setTimeout(async () => {
          if (
            (await this.getOrderSaleIsActive(recordSale.orderIndex)) == true
          ) {
            checkSaleActive();
          }
        }, timeout * 1000);
      }

      checkSaleActive.call(this);
    }
  }

  async getOrderSaleActiveStartListen() {
    // запускает getOrderSaleActiveListen на все записи в stateSaleRepository
    const stateCards = await this.stateBidRepository.find();
    stateCards.forEach(async card => {
      this.getOrderSaleActiveListen(card);
    });
  }

  async getOrderBidsActiveListen(recordBid: StateBidEntity) {
    // устанавливает будильник на ордер ставки для проверки активности
    if (recordBid.active == true) {
      function checkBidsActive() {
        let time = recordBid.expirationTime - this.currentTimestamp + 7;
        setTimeout(async () => {
          if ((await this.getOrderBidsIsActive(recordBid.orderIndex)) == true) {
            checkBidsActive();
          }
        }, time * 1000);
      }

      checkBidsActive.call(this);
    }
  }

  async getOrderBidsActiveStartListen() {
    // запускает getOrderBidsActiveListen на все записи в stateBidRepository
    const stateCards = await this.stateBidRepository.find();
    stateCards.forEach(async card => {
      this.getOrderBidsActiveListen(card);
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: 'mintEvents' })
  async bttcMintEvents() {
    const job = this.schedulerRegistry.getCronJob('mintEvents');

    job.stop();
    try {
      const pastEvents =
        await this.blockchainService.cardContract.getPastEvents(
          CardContractEvents.TRANSFER,
          this.web3,
        );
      pastEvents.map(async event => {
        try {
          const transaction = await this.web3.eth.getTransaction(
            event.transactionHash,
          );
          const startFunction = transaction.input.substring(0, 10);
          const block = await this.web3.eth.getBlock(transaction.blockNumber);

          const param = {
            block: transaction.blockNumber,
            timestamp: Number(block.timestamp),
            contract: this.blockchainService.cardContract.address,
            method: startFunction,
            transaction: event.transactionHash,
            address: event.returnValues.to,
            tokenId: Number(event.returnValues.tokenId),
            createdTokenId: Number(event.returnValues.tokenId),
            contractTriger: transaction.from,
          };
          const eventsMint = new MintEntity();
          const eventsSaleMint = new SaleAndMintEntity();

          const checkTransaction = await this.MintRepository.findOne({
            where: { transaction: event.transactionHash },
          });
          const checksaleAndMintTransaction =
            await this.saleAndMintRepository.findOne({
              where: { transaction: event.transactionHash },
            });
          if (
            event.returnValues.from ==
            '0x0000000000000000000000000000000000000000'
          ) {
            if (!checkTransaction) {
              Object.assign(eventsMint, param);
              await this.MintRepository.save(eventsMint);
            }
            if (!checksaleAndMintTransaction) {
              eventsSaleMint.tableId = 'mint';
              eventsSaleMint.name = 'Mint';
              Object.assign(eventsSaleMint, param);

              await this.saleAndMintRepository.save(eventsSaleMint);
            }
          } else {
            if (!checksaleAndMintTransaction) {
              eventsSaleMint.tableId = 'sale';
              eventsSaleMint.name = 'Sale';
              Object.assign(eventsSaleMint, param);

              await this.saleAndMintRepository.save(eventsSaleMint);
            }
          }

          await this.cardRepositoryTypeorm.update(
            {
              cardId: Number(event.returnValues.tokenId),
            },
            { minted: true, ownerAddress: event.returnValues.to },
          );
        } catch (e) {
          //console.log(event);
          console.log(
            `Skip event mint "${event.event}" ${event.transactionHash} ${event.returnValues.tokenId}`,
          );
          console.log('Skip event mint', e);
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      job.start();
    }
  }

  /*async eventsMintListen() { // прослушивает евенты из CONTRACT_CARD и записывает их в saleAndMintRepository и MintRepository
    const series = new Series();
    this.tron.eventsListen(ContractsConfig.CONTRACT_CARD, events => {
      series.push(...events).process(async event => {
        if (event.name == 'Transfer') {
          console.log('Transfer_MINT', event);
          try {
            const transaction = await this.getTronscanContractinfo(
              event.transaction,
            );
            if (transaction.list[0].method.toLowerCase().startsWith('mint')) {
              const param = {
                block: event.block,
                timestamp: event.timestamp,
                contract: event.contract,
                method: transaction.list[0].method,
                transaction: event.transaction,
                address: transaction.list[0].owner_address,
                tokenId: Number(event.result._tokenId),
                createdTokenId: Number(event.result._tokenId),
                contractTriger: transaction.list[0].contract_address,
              };

              const eventsMint = this.MintRepository.create(param);
              await this.MintRepository.save(eventsMint);

              const saleGeneral = this.saleAndMintRepository.create({
                ...param,
                tableId: 'mint',
                name: 'Mint',
              });
              await this.saleAndMintRepository.save(saleGeneral);

              await this.cardRepositoryTypeorm.update(
                {
                  cardId: Number(event.result._tokenId),
                },
                { minted: true, ownerAddress: this.tron.addressFromHex(event.result._to) },
              );
              // console.log(eventsMint);
            } else if (
              transaction.list[0].method
                .toLowerCase()
                .startsWith('transferfrom') || transaction.list[0].method
                .toLowerCase()
                .startsWith('buy')
            ) {
              // console.log('transferfrom', event, this.tron.addressFromHex(event.result._to));
              await this.cardRepositoryTypeorm.update(
                {
                  cardId: Number(event.result._tokenId),
                },
                { ownerAddress: this.tron.addressFromHex(event.result._to) },
              );
            }
          } catch (e) {
            console.log('Mint ERROR', e);
          }
        }
      });
    });
  }
   */

  /* async getTronscanContractinfo(hash: string) { // возвращает информацию о транзакции по хэшу
    const response = await this.tron.getTronscanContract(hash);
    return response;
  }
  */
}
