import { NftService } from '@app/common/nft';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { InWalletListedEnum } from 'apps/auth/src/enums/inWalletListed.enum';
import {
  Card,
  CardDocument,
  Faces,
  Suits,
} from 'apps/cards-cli/src/models/card';
import { Model } from 'mongoose';
import { CardEntity, CardGroup } from '../events/entities/card.entity';
import { FindOperator, In, Repository } from 'typeorm';
import { SaleAndMintEntity } from '../events/entities/sale-and-mint.entity';
import { StateBidEntity } from '../events/entities/state-bid.entity';
import { StateSaleEntity } from '../events/entities/state-sale.entity';
import { EventsService } from '../events/events.service';
import { OrderType } from './order-type.enums';
import { parseAsync } from 'json2csv';
import * as fs from 'fs/promises';
import { createWriteStream, WriteStream } from 'fs';
import * as path from 'node:path';

// import {  }

export type OptionsParams = {
  cardsId?: number[];
  limit?: number;
  skip?: number;
  suits?: Suits[];
  faces?: Faces[];
  tears?: boolean;
  addressSeller?: string;
  count?: boolean;
  traits?: boolean;
  // isRare?: boolean;

  stateSale?: boolean;
  stateBids?: boolean;

  active?: boolean;
  endPoint?: string;

  // historySale?: { skip?: number, take?: number },
  // historyBids?: { skip?: number, take?: number },
  // removeUnused?: boolean,
  order?: OrderType;

  inWalletListed?: InWalletListedEnum;

  minted?: boolean;
  ownerAddress?: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export type getOptionParams = {
  cardsId?: number[];
  limit?: number;
  skip?: number;
};

@Injectable()
export class MarketplaceService {
  // private ready = true;

  constructor(
    private readonly nftsService: NftService,
    @InjectModel(Card.name) private cardRepository: Model<CardDocument>,
    @InjectRepository(StateBidEntity)
    private stateBidRepository: Repository<StateBidEntity>,
    @InjectRepository(CardEntity)
    private cardRepositoryTypeorm: Repository<CardEntity>,
    @InjectRepository(SaleAndMintEntity)
    private saleAndMintRepository: Repository<SaleAndMintEntity>,
    @InjectRepository(StateSaleEntity)
    private stateSaleRepository: Repository<StateSaleEntity>,
  ) {}

  async getCardsCount(filter = {}) {
    // возвращает количество карт
    return this.cardRepositoryTypeorm.count({ where: filter }); //this.cardRepository.count(filter);
  }

  async getTokensByAddress(options: {
    // возвращает карты принадлежащие адресу
    address?: string;
    take?: InWalletListedEnum;
    addressSeller?: string;
    tokenIsNull?: boolean;
  }): Promise<number[]> {
    if (options.take == undefined) {
      options.take = InWalletListedEnum.All;
    }
    if (options.addressSeller == undefined) {
      options.addressSeller = options.address;
    }
    if (options.tokenIsNull == undefined) {
      options.tokenIsNull = false;
    }

    const walletCards =
      options.address &&
      (options.take == InWalletListedEnum.All ||
        options.take == InWalletListedEnum.Wallet)
        ? await this.nftsService.getAddressCardsList(
            options.address /*, dto, CardsId*/,
          )
        : [];
    const sellerCardsSale =
      options.take == InWalletListedEnum.All ||
      options.take == InWalletListedEnum.Sale ||
      options.take == InWalletListedEnum.Listed
        ? (
            await this.getActualSaleOrderBySeller(
              options.addressSeller,
              options.tokenIsNull,
            )
          ).map(stateCard => stateCard.tokenId)
        : [];

    const sellerCardsBid =
      options.take == InWalletListedEnum.All ||
      options.take == InWalletListedEnum.Bids ||
      options.take == InWalletListedEnum.Listed
        ? (
            await this.getActualBidOrderBySeller(
              options.addressSeller,
              options.tokenIsNull,
            )
          ).map(stateCard => stateCard.tokenId)
        : [];
    console.log(walletCards, sellerCardsBid, sellerCardsSale);
    return [...walletCards, ...sellerCardsBid, ...sellerCardsSale];
  }

  async getSmartContractNft(address): Promise<any> {
    return await this.nftsService.getAddressCardsList(
      address /*, dto, CardsId*/,
    );
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

  async getActualSaleOrderBySeller(
    // возвращает актуальные продажи по адрессу продавца
    addressSeller?: string,
    tokenIsNull = false,
  ) {
    const query = this.stateSaleRepository.createQueryBuilder('sale');
    if (addressSeller) {
      query.where({ seller: addressSeller });
    }
    if (tokenIsNull != undefined) {
      query.andWhere(
        `sale.tokenId IS ${tokenIsNull == false ? 'NOT' : ''} NULL`,
      );
    }

    return await query.getMany();
  }

  async getCardList(options: getOptionParams) {
    if (options.limit) {
      options.limit = Math.min(100, options.limit);
    } else {
      options.limit = 100;
    }

    const count = await this.getCardsCount();
    options.cardsId.forEach(cardId => {
      if (cardId < 0 || cardId >= count) {
        throw new HttpException('Карта с таким номером отсутствует в бд', 403);
      }
    });

    let where = {};

    if (options.cardsId) {
      where = {
        cardId: In(options.cardsId),
      };
    }

    let cards = await this.cardRepository.find({
      where: where,
      skip: options.skip || 0,
      take: options.limit || 10,
    });
    // @ts-ignore

    return {
      cards,
    };
  }

  async marketplaceExportCard(
    // возвращает карты взависимости от фильтров
    options: OptionsParams = {
      count: false,
    },
  ) {
    if (options.limit) {
      options.limit = Math.min(100, options.limit);
    } else {
      options.limit = 100;
    }

    const count = await this.getCardsCount();

    options.cardsId.forEach(cardId => {
      if (cardId < 0 || cardId >= count) {
        throw new HttpException('Карта с таким номером отсутствует в бд', 403);
      }
    });

    const query = this.cardRepositoryTypeorm.createQueryBuilder('card');
    const columns = [
      'card.cardId',
      'card.name',
      'card.face',
      'card.suit',
      'card.tears',
      'card.url',
      'card.faceFrequency',
      'card.suitFrequency',
      'card.maxRarity',
      'card.mediumRarity',
      'card.frequencyRarity',
      'card.hash',
      'card.minted',
      'card.ownerAddress',
    ];
    if (options?.traits) {
      columns.push('card.traits');
    }
    query.select(columns);

    const where: {
      cardId?: FindOperator<any>;
      suit?: FindOperator<any>;
      // face?: FindOperator<any>;
      // name?: FindOperator<any>;
      // group?: number;
      tears?: boolean;
      address?: string;
      active?: boolean;
      minted?: boolean;
      ownerAddress?: string;
    } = {};

    if (options.minted != undefined) {
      where.minted = options.minted;
    }

    if (options.cardsId.length > 0) {
      where.cardId = In(options.cardsId);
    }
    if (options.suits) {
      where.suit = In(options.suits);
    }
    if (options.ownerAddress) {
      where.ownerAddress = options.ownerAddress;
    }

    query.where(where);
    query.orderBy('card.cardId', options.order ? options.order : 'ASC');

    if (options.faces) {
      const bits = CardGroup.groupBit(
        ...options.faces.map(name => name.toLowerCase()),
      );
      const sql = `(card.group & ${bits}) > 0`;
      console.log('options.faces', bits, sql);
      query.andWhere(sql);
    }

    if (
      // options.cardsId.length > 1 &&
      options.active != undefined &&
      (options.endPoint == 'saleList' || options.endPoint == 'offerSaleList')
    ) {
      query.leftJoinAndSelect(
        StateSaleEntity,
        'asales',
        'card.cardId = asales.tokenId',
      );
      query.andWhere(`asales.active = '${options.active}'`);
    }
    if (
      options.active != undefined &&
      (options.endPoint == 'offerList' ||
        options.endPoint == 'offerSaleList') &&
      options.stateBids
    ) {
      query.leftJoinAndSelect(
        StateBidEntity,
        'abids',
        'card.cardId = abids.createdTokenId',
      );
      if (
        //options.cardsId.length > 1 &&
        options.endPoint == 'offerSaleList'
      ) {
        query.orWhere(`abids.active = '${options.active}'`);
      } else {
        query.andWhere(`abids.active = '${options.active}'`);
      }
    }

    if (options.addressSeller) {
      query.leftJoinAndSelect(
        StateBidEntity,
        'obids',
        'card.cardId = obids.tokenId',
      );
      query.leftJoinAndSelect(
        StateSaleEntity,
        'osales',
        'card.cardId = osales.tokenId',
      );
      query.andWhere(
        `obids.seller = '${options.addressSeller}' OR osales.seller = '${options.addressSeller}'`,
      );
      if (options.active != undefined) {
        query.andWhere(
          `obids.active = '${options.active}' OR osales.active = '${options.active}'`,
        );
      }
    }
    console.log(options);

    if (options.stateBids) {
      query.leftJoinAndMapOne(
        'card.state_bids',
        StateBidEntity,
        'bids',
        'card.cardId = bids.tokenId OR card.cardId = bids.createdTokenId',
      );
      query.addSelect('bids.bidsSum');

      if (options.order) {
        query.orderBy('bids.bidsSum', options.order, 'NULLS LAST');
      }
    }
    if (options.stateSale) {
      query.leftJoinAndMapOne(
        'card.state_sale',
        StateSaleEntity,
        'sales',
        'card.cardId = sales.tokenId',
      );
      query.addSelect('sales.price');
      if (options.order) {
        query.orderBy('sales.price', options.order, 'NULLS LAST');
      }
    }

    if (options.limit) query.limit(options.limit);
    if (options.skip) query.offset(options.skip);

    if (options.count) {
      return query.getCount();
    } else {
      if (options.cardsId.length == 0 || options.cardsId.length > 1) {
        let responses = await query.getMany();

        responses = responses.map(response => {
          response.url = response.url.replace(
            'https://ipfs.io/ipfs/',
            'https://flipsies.infura-ipfs.io/ipfs/',
          );
          response.url = response.url.replace(
            'http://gateway.btfs.io/btfs/',
            'https://flipsies.infura-ipfs.io/ipfs/',
          );

          return response;
        });

        return responses;
      } else {
        const response = await query.getOne();
        if (response == null) {
          return [];
        }

        response.url = response.url.replace('https://ipfs.io/ipfs/', '');
        return [response];
      }
    }
  }

  async marketplaceImportCard(cardJson: Object) {
    return this.cardRepository.create(cardJson);
  }

  async personalBids(
    // возвращает карты на которые "ты" сделал ставки
    options: OptionsParams = {
      count: false,
    },
  ) {
    let request = `SELECT ${
      options.count == true
        ? 'COUNT(*) as "timestamp"'
        : ` "id", "createdAt",
      "updatedAt", "transaction",
      "orderIndex", "seller",
      "tokenId", "createdTokenId",
      "timestamp", "expirationTime",
      "active", "bids", "bidsSum",
      "cardId", "name",
      "face", "suit",
      "tears", "url",
      "faceFrequency", "suitFrequency",
      "maxRarity", "mediumRarity",
      "frequencyRarity", "hash" `
    }
  FROM(SELECT *
    FROM "state_bid_entity" as bid 
        WHERE bid."bids" ?& array['${options.addressSeller}']) mybids
            LEFT JOIN
        "card_entity" card
        ON mybids."createdTokenId" = card."cardId"
        ORDER BY "timestamp" ${
          options.order == 'DESC' ? options.order : 'ASC'
        }`;

    if (options.count != true) {
      request += `\nLIMIT ${
        options.limit != undefined ? options.limit : 'ALL'
      } OFFSET ${options.skip != undefined ? options.skip : 0}`;
    } else {
      return (await this.stateBidRepository.query(request))[0].timestamp;
    }

    return this.stateBidRepository.query(request);
  }

  async adminPanel(timestampBefore, timestampAfter, order: OrderType) {
    // возвращает файл с событиями произошедшими в определённый период вермени
    const columns = [
      'card.id',
      'card.createdAt',
      'card.updatedAt',
      'card.block',
      'card.timestamp',
      'card.contract',
      'card.transaction',
      'card.tokenId',
      'card.tableId',
      'card.name',
      'card.seller',
      'card.buyer',
      'card.price',
      'card.amount',
      'card.total',
    ];
    const fields = [
      'id',
      'createdAt',
      'updatedAt',
      'block',
      'timestamp',
      'contract',
      'transaction',
      'tokenId',
      'tableId',
      'name',
      'seller',
      'buyer',
      'price',
      'amount',
      'total',
    ];
    const getTimestamp = async (orderBy: OrderType) => {
      const query = this.saleAndMintRepository
        .createQueryBuilder()
        .orderBy('timestamp', orderBy)
        .take(1);
      const result = await query.getOne();
      if (result !== null) {
        return result.timestamp;
      }
      return 0;
    };
    const timeBefore = timestampBefore
      ? new Date(timestampBefore).getTime() / 1000
      : await getTimestamp(OrderType.DESC);
    const timeAfter = timestampAfter
      ? new Date(timestampAfter).getTime() / 1000
      : await getTimestamp(OrderType.ASC);
    if (isNaN(timeBefore) || isNaN(timeAfter))
      throw new ForbiddenException('Format data timestamp 2022-01-20');
    console.log(timeAfter);
    const query = this.saleAndMintRepository
      .createQueryBuilder('card')
      .select(columns)
      .andWhere(`${timeBefore} <= card.timestamp`)
      .andWhere(`${timeAfter} >= card.timestamp`);
    const result = await query.getMany();

    const fileName = `${Date.now()}.csv`;
    const pathFile = path.resolve(`./upload/${fileName}`);
    const writeStream = createWriteStream(pathFile, {
      highWaterMark: 128,
      encoding: 'utf-8',
    });

    this.writeData(
      writeStream,
      Buffer.from(fields.map(name => `"${name}"`).join(',') + '\n'),
    );

    let skip = 0;

    console.log(result);

    const buffer: Buffer = await this.jsonToCsvBuffer(result, fields);
    if (buffer !== null) {
      await this.writeData(writeStream, buffer);
      writeStream.end();
      writeStream.emit('finish');
    }

    const fileExpiration = 10000;

    setTimeout(() => {
      fs.unlink(pathFile);
    }, fileExpiration);

    return { fileName, pathFile };
  }

  async getCardByOwnerAddress(ownerAddress: string) {
    return await this.cardRepositoryTypeorm.findOne({
      where: { ownerAddress: ownerAddress },
    });
  }

  private async writeData(
    writeStream: WriteStream,
    data: Buffer,
  ): Promise<boolean> {
    return new Promise(resolve => {
      const canWrite = writeStream.write(data);
      if (!canWrite) {
        writeStream.once('drain', () => resolve(true));
      } else {
        resolve(true);
      }
    });
  }

  private async jsonToCsvBuffer(
    result: SaleAndMintEntity[],
    fields: string[],
  ): Promise<Buffer | null> {
    return new Promise(async (res, rej) => {
      const opts = { fields, header: false };
      parseAsync(result, opts)
        .then(csv => res(Buffer.from(csv)))
        .catch(err => {
          console.error(err);
          rej(null);
        });
    });
  }
}

// `SELECT "createdTokenId" FROM "state_bid_entity" as e WHERE e."bids" ?& array['${options.addressSeller}']; `
// "id", "createdAt", "updatedAt", "block", "timestamp", "contract", "name", "transaction", "orderIndex", "seller", "tokenId", "expirationTime", "buyer", "amount"
// "id", "createdAt", "updatedAt", "transaction", "orderIndex", "seller", "tokenId", "createdTokenId", "timestamp", "expirationTime", "active", "bids", "bidsSum",
//  "cardId", "name", "face", "suit", "tears", "url", "faceFrequency", "suitFrequency", "maxRarity", "mediumRarity", "frequencyRarity", "hash"
