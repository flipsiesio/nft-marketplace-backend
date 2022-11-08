import {
  Controller,
  Get,
  Req,
  Query,
  InternalServerErrorException,
  applyDecorators,
  Res,
  RequestTimeoutException,
  ForbiddenException,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  MarketplaceService,
  OptionsParams,
} from './marketplace/marketplace.service';
import { EventsService } from './events/events.service';
import { Request, Response } from 'express';
import { Auth } from '../../auth/src/decorators/auth.decorator';
import { Faces, Suits } from 'apps/cards-cli/src/models/card';
import { queryToArray, queryToBoolean, queryToNumber } from './query';
import { OrderType } from './marketplace/order-type.enums';
import { InWalletListedEnum } from 'apps/auth/src/enums/inWalletListed.enum';
import { createReadStream, existsSync } from 'node:fs';
import { NftCountGuard } from './../../auth/src/guards/nft-count.guard';

export enum ENV {
  Production = 'production',
  Development = 'development',
  Local = 'local',
}

function SwaggerOptionsCards() {
  return applyDecorators(
    ApiQuery({
      name: 'cardsId',
      type: Array,
      required: false,
      description: 'Номера карт в виде массива для получения информации о них',
    }),

    ApiQuery({ name: 'limit', type: Number, required: false, description: '' }),
    ApiQuery({ name: 'skip', type: Number, required: false, description: '' }),
    ApiQuery({
      name: 'suits',
      type: Array,
      required: false,
      description:
        'Фильтр по масти (Clubs, Diamonds, Hearts, Spades, Red, Black)',
    }),
    ApiQuery({
      name: 'faces',
      type: Array,
      required: false,
      description: 'Фильтр по значению (Jack, Queen, King, Joker, Rare)',
    }),
    ApiQuery({
      name: 'tears',
      type: Boolean,
      required: false,
      description: 'Фильтр по слёзам',
    }),
    ApiQuery({
      name: 'addressSeller',
      type: String,
      required: false,
      description: 'Фильтр по адресу владельца',
    }),
    ApiQuery({
      name: 'count',
      type: Boolean,
      required: false,
      description: 'Вывести только количетсво',
    }),
    ApiQuery({
      name: 'traits',
      type: Boolean,
      required: false,
      description: 'Включить поле traits в карты',
    }),
    ApiQuery({
      name: 'stateSale',
      type: Boolean,
      required: false,
      description: 'Включить актуальные данные по продаже в карты',
    }),
    ApiQuery({
      name: 'stateBids',
      type: Boolean,
      required: false,
      description: 'Включить актуальные данные по ставкам в карты',
    }),
    ApiQuery({
      name: 'order',
      type: String,
      required: false,
      description:
        'Сортировка по цене Sale и Bids (ASC | DESC). Работает для stateSale, stateBids',
    }),

    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );
}

class OptionsDto {
  cardsId?: Array<number>;

  limit?: string;
  skip?: string;
  suits?: Array<Suits>;
  faces?: Array<Faces>;
  tears?: string;
  addressSeller?: string;
  count?: string;
  traits?: string;
  stateSale?: string;
  stateBids?: string;
  // isRare?: string;
  order?: OrderType;
  inWalletListed?: InWalletListedEnum;
  active?: string;
  minted?: string;
  ownerAddress: string;
}

const optionsPrepare = (dto: OptionsDto) => {
  const options: OptionsParams = {};

  options.cardsId = queryToArray(dto.cardsId);
  if (options.cardsId) {
    options.cardsId = options.cardsId.map(cardId => Number(cardId));
  }

  if (dto.limit) {
    options.limit = Number(dto.limit);
  }
  if (dto.skip) {
    options.skip = Number(dto.skip);
  }
  if (dto.suits) {
    options.suits = queryToArray(dto.suits);
  }
  if (dto.faces) {
    options.faces = queryToArray(dto.faces);
  }
  if (dto.tears) {
    options.tears = dto.tears == 'true' ? true : false;
  }
  if (dto.addressSeller) {
    options.addressSeller = dto.addressSeller;
  }
  if (dto.count) {
    options.count = dto.count == 'true' ? true : false;
  }
  if (dto.traits) {
    options.traits = dto.traits == 'true' ? true : false;
  }
  if (dto.stateSale) {
    options.stateSale = dto.stateSale == 'true' ? true : false;
  }
  if (dto.stateBids) {
    options.stateBids = dto.stateBids == 'true' ? true : false;
  }
  if (dto.minted) {
    options.minted = dto.minted == 'true' ? true : false;
  }
  // if (dto.isRare) {
  //   options.isRare = dto.isRare == 'true' ? true : false;
  // }
  if (dto.order) {
    options.order = dto.order == OrderType.ASC ? OrderType.ASC : OrderType.DESC;
  }
  if (dto.inWalletListed) {
    options.inWalletListed = dto.inWalletListed;
  }
  if (dto.active) {
    options.active = dto.active == 'true' ? true : false;
  }

  return options;
};

function prevent(options: OptionsParams, cardsId: number[]) {
  if (cardsId.length == 0) return options.count ? 0 : [];

  if (options.cardsId.length > 0) {
    options.cardsId = cardsId.filter(cardId => {
      return options.cardsId.includes(cardId);
    });

    if (options.cardsId.length == 0) return options.count ? 0 : [];
  } else {
    options.cardsId = cardsId;
  }
}

@ApiTags('marketplace')
@Controller('api/marketplace')
export class MainMarketplaceController {
  constructor(
    private readonly marketplaceService: MarketplaceService,
    private readonly eventsService: EventsService, // private readonly authService: AuthService,
  ) {
    this.eventsService.start();
  }

  @Get('card-list')
  @applyDecorators(
    ApiOperation({
      summary: 'Получение списка карт',
    }),
    ApiQuery({
      name: 'cardsId',
      type: Array,
      required: false,
      description: 'В случае ввода номеров карт, является фильтром',
    }),
    SwaggerOptionsCards(),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
  async getCardList(@Query() dto: OptionsDto) {
    const options = optionsPrepare(dto);
    return this.marketplaceService.marketplaceExportCard(options); //, { historyBids, historySale, stateBids, stateSale }); //([38, 44, 45, 6519, 6524]); //this.nftsService.getNftCard(tokenId);
  }

  //@Auth()
  //@UseGuards(NftCountGuard)
  @Get('sale-list')
  @applyDecorators(
    ApiOperation({
      summary: 'Получение информации о картах находящихся на продаже (sale)',
    }),
    ApiQuery({
      name: 'cardsId',
      type: Array,
      required: false,
      description: 'В случае ввода номеров карт, является фильтром',
    }),
    ApiQuery({
      name: 'addressSeller',
      type: String,
      required: false,
      description: '(Не имеет значения)',
    }),
    ApiQuery({
      name: 'stateSale',
      type: Boolean,
      required: false,
      description: '(Не имеет значения)',
    }),
    ApiQuery({
      name: 'active',
      type: Boolean,
      required: false,
      description: 'статус активности',
    }),
    ApiQuery({
      name: 'tokenIsNull',
      type: Boolean,
      required: false,
      description: 'find where token Is Null',
    }),
    SwaggerOptionsCards(),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
  async getSaleList(
    @Query() dto: OptionsDto,
    @Query('tokenIsNull') tokenIsNull: string,
  ) {
    const options = optionsPrepare(dto);

    const cardsId = await this.marketplaceService.getTokensByAddress({
      take: InWalletListedEnum.Sale,
      addressSeller: options.addressSeller,
      tokenIsNull: queryToBoolean(tokenIsNull),
    });

    const pre = prevent(options, cardsId);
    if (pre != undefined) return pre;

    options.stateSale = true;
    options.endPoint = 'saleList';
    return this.marketplaceService.marketplaceExportCard(options);
  }

  @Auth()
  @UseGuards(NftCountGuard)
  @Get('offer-list')
  @applyDecorators(
    ApiOperation({
      summary: 'Получение информации о картах находящихся на "аукционе" (bids)',
    }),
    ApiQuery({
      name: 'cardsId',
      type: Array,
      required: false,
      description: 'В случае ввода номеров карт, является фильтром',
    }),
    ApiQuery({
      name: 'addressSeller',
      type: String,
      required: false,
      description: '(Не имеет значения)',
    }),
    ApiQuery({
      name: 'stateBids',
      type: Boolean,
      required: false,
      description: '(Не имеет значения)',
    }),
    ApiQuery({
      name: 'inWalletListed',
      enum: InWalletListedEnum,
      required: false,
      description: 'Показать inWallet/Listed/All карты по адрессу',
    }),
    ApiQuery({
      name: 'active',
      type: Boolean,
      required: false,
      description: 'статус активности',
    }),
    ApiQuery({
      name: 'tokenIsNull',
      type: Boolean,
      required: false,
      description: 'find where token Is Null',
    }),
    SwaggerOptionsCards(),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
  async getOfferList(
    @Query() dto: OptionsDto,
    @Query('tokenIsNull') tokenIsNull: string,
  ) {
    const options = optionsPrepare(dto);

    const cardsId = await this.marketplaceService.getTokensByAddress({
      take: InWalletListedEnum.Bids,
      addressSeller: options.addressSeller,
      tokenIsNull: queryToBoolean(tokenIsNull),
    });

    const pre = prevent(options, cardsId);
    if (pre != undefined) return pre;
    options.stateBids = true;
    options.endPoint = 'offerList';
    return this.marketplaceService.marketplaceExportCard(options);
  }

  @Auth()
  @UseGuards(NftCountGuard)
  @Get('offer-sale-list')
  @applyDecorators(
    ApiOperation({
      summary: 'Получение всех карт находящихся на аукцитоне и на продаже',
    }),
    ApiQuery({
      name: 'addressSeller',
      type: String,
      required: false,
      description: '(Не имеет значения)',
    }),
    ApiQuery({
      name: 'active',
      type: Boolean,
      required: false,
      description: 'статус активности',
    }),
    ApiQuery({
      name: 'tokenIsNull',
      type: Boolean,
      required: false,
      description: 'find where token Is Null',
    }),
    SwaggerOptionsCards(),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
  async getOfferSaleList(
    @Query() dto: OptionsDto,
    @Query('tokenIsNull') tokenIsNull: string,
  ) {
    const options = optionsPrepare(dto);
    let cardsIdBids = [];
    let cardsIdSale = [];
    let pre;
    if (options.cardsId.length !== 0) {
      options.active = undefined;
    }
    if (
      (options.stateBids && !options.stateSale) ||
      (!options.stateBids && !options.stateSale)
    ) {
      cardsIdBids = await this.marketplaceService.getTokensByAddress({
        take: InWalletListedEnum.Bids,
        addressSeller: options.addressSeller,
        tokenIsNull: queryToBoolean(tokenIsNull),
      });
    }
    if (
      (options.stateSale && !options.stateBids) ||
      (!options.stateBids && !options.stateSale)
    ) {
      cardsIdSale = await this.marketplaceService.getTokensByAddress({
        take: InWalletListedEnum.Sale,
        addressSeller: options.addressSeller,
        tokenIsNull: queryToBoolean(tokenIsNull),
      });
    }
    pre = prevent(options, cardsIdBids.concat(cardsIdSale));
    if (pre != undefined) return pre;

    if (!options.stateBids && !options.stateSale) {
      options.stateBids = true;
      options.stateSale = true;
    }
    options.endPoint = 'offerSaleList';
    return this.marketplaceService.marketplaceExportCard(options);
  }

  @Get('offer-sale-list-test')
  async getOfferSaleListTest(
    @Query() dto: OptionsDto,
    @Query('tokenIsNull') tokenIsNull: string,
    @Body() body: any,
  ) {
    const options = optionsPrepare(dto);
    let cardsIdBids = [];
    let cardsIdSale = [];
    let pre;
    if (options.cardsId.length !== 0) {
      options.active = undefined;
    }
    if (
      (options.stateBids && !options.stateSale) ||
      (!options.stateBids && !options.stateSale)
    ) {
      cardsIdBids = await this.marketplaceService.getTokensByAddress({
        take: InWalletListedEnum.Bids,
        addressSeller: options.addressSeller,
        tokenIsNull: queryToBoolean(tokenIsNull),
      });
    }
    if (
      (options.stateSale && !options.stateBids) ||
      (!options.stateBids && !options.stateSale)
    ) {
      cardsIdSale = await this.marketplaceService.getTokensByAddress({
        take: InWalletListedEnum.Sale,
        addressSeller: options.addressSeller,
        tokenIsNull: queryToBoolean(tokenIsNull),
      });
    }
    pre = prevent(options, cardsIdBids.concat(cardsIdSale));
    if (pre != undefined) return pre;

    if (!options.stateBids && !options.stateSale) {
      options.stateBids = true;
      options.stateSale = true;
    }

    options.endPoint = 'offerSaleList';

    return this.marketplaceService.marketplaceExportCard(options);
  }

  @Auth()
  @UseGuards(NftCountGuard)
  @Get('personal-list')
  @applyDecorators(
    ApiOperation({ summary: 'Получение информации о картах пользователя' }),
    ApiQuery({
      name: 'cardsId',
      type: Array,
      required: false,
      description: 'В случае ввода номеров карт, является фильтром',
    }),
    ApiQuery({
      name: 'addressSeller',
      type: String,
      required: false,
      description: '(Не имеет значения)',
    }),
    ApiQuery({
      name: 'inWalletListed',
      enum: InWalletListedEnum,
      required: false,
      description: 'Показать inWallet/Listed/All карты по адрессу',
    }),
    SwaggerOptionsCards(),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
  async getPersonalList(
    @Req() req: Request & { user: { tronWalletAddress: string } },
    @Query() dto: OptionsDto,
  ) {
    const options = optionsPrepare(dto);

    const tronWalletAddress = req?.user?.tronWalletAddress;

    const cardsId = await this.marketplaceService.getTokensByAddress({
      address: tronWalletAddress,
      take: options.inWalletListed,
    });

    const pre = prevent(options, cardsId);
    if (pre != undefined) return pre;

    if (!tronWalletAddress) {
      throw new InternalServerErrorException(
        'empty user tronWalletAddress internal server error',
      );
    }

    // options.ownerAddress = tronWalletAddress;

    return this.marketplaceService.marketplaceExportCard(options);
  }

  @Auth()
  @UseGuards(NftCountGuard)
  @Get('personalBids')
  @applyDecorators(
    ApiOperation({ summary: 'Получение информации о сделанных ставках' }),
    ApiQuery({
      name: 'count',
      type: Boolean,
      required: false,
      description: 'Вывести только количество',
    }),
    ApiQuery({
      name: 'order',
      enum: OrderType,
      required: false,
      description: 'Сортировка по timestampe ASC|DESC ',
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'limit',
    }),
    ApiQuery({
      name: 'skip',
      type: Number,
      required: false,
      description: 'offset',
    }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
  async personalBids(
    @Req() req: Request & { user: { tronWalletAddress: string } },
    @Query() dto: OptionsDto,
  ) {
    const options = optionsPrepare(dto);
    const tronWalletAddress = req?.user?.tronWalletAddress;
    if (!tronWalletAddress) {
      throw new InternalServerErrorException(
        'empty user tronWalletAddress internal server error',
      );
    }

    options.addressSeller = tronWalletAddress;
    options.inWalletListed = InWalletListedEnum.Listed;
    return this.marketplaceService.personalBids(options);
  }

  @Get('personalBids-test')
  async personalBids2(
    @Req() req: Request & { user: { tronWalletAddress: string } },
    @Query() dto: OptionsDto,
    @Body() body: any,
  ) {
    const tronWalletAddress = body.tronw;
    const options = optionsPrepare(dto);
    // const tronWalletAddress = req?.user?.tronWalletAddress;

    if (!tronWalletAddress) {
      throw new InternalServerErrorException(
        'empty user tronWalletAddress internal server error',
      );
    }

    options.addressSeller = tronWalletAddress;
    options.inWalletListed = InWalletListedEnum.Listed;
    return this.marketplaceService.personalBids(options);
  }

  @Auth()
  @UseGuards(NftCountGuard)
  @Get('getCards')
  @applyDecorators(
    ApiOperation({ summary: 'Получение информации о картах и сортировка' }),
    SwaggerOptionsCards(),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
  getCards(@Query() dto: OptionsDto) {
    dto.minted = 'true';
    console.log(dto);
    const options = optionsPrepare(dto);

    return this.marketplaceService.marketplaceExportCard(options); //, { historyBids, historySale, stateBids, stateSale }); //([38, 44, 45, 6519, 6524]); //this.nftsService.getNftCard(tokenId);
  }

  @applyDecorators(
    ApiOperation({ summary: 'Возвращает историю продаж' }),
    ApiQuery({
      name: 'byOrder',
      type: Boolean,
      required: false,
      description: 'Поиск по ордерам, если true, иначе по токенам',
    }),
    ApiQuery({
      name: 'ids',
      type: Array,
      required: false,
      description:
        'Выбрать конкретные номера карт для получения истории по ним или оставить пустым',
    }),
    ApiQuery({ name: 'skip', type: Number, required: false }),
    ApiQuery({
      name: 'take',
      type: Number,
      required: false,
      description: 'Максимум 100 записей',
    }),
    ApiQuery({
      name: 'count',
      type: Boolean,
      required: false,
      description: 'Вывести кол-во записей',
    }),
    ApiQuery({
      name: 'active',
      type: Boolean,
      required: false,
      description: 'статус активности',
    }),
    ApiQuery({
      name: 'order',
      enum: OrderType,
      required: false,
      description: 'сортировка по timestamp, ASC|DESC',
    }),
  )
  @Auth()
  @UseGuards(NftCountGuard)
  @Get('getSaleHistory')
  async getSaleHistory(
    @Query('byOrder') byOrder: string,
    @Query('ids') ids: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('count') count: string,
    @Query('active') active: string,
    @Query('order') order: OrderType,
  ) {
    return this.eventsService.getSaleHistory(
      queryToBoolean(byOrder, false),
      queryToArray(ids).map(id => queryToNumber(id)),
      queryToNumber(skip),
      Math.min(100, queryToNumber(take)),
      queryToBoolean(count, false),
      queryToBoolean(active, undefined),
      order,
    );
  }

  @applyDecorators(
    ApiOperation({ summary: 'Возвращает историю продаж' }),
    ApiQuery({
      name: 'byOrder',
      type: Boolean,
      required: false,
      description: 'Поиск по ордерам, если true, иначе по токенам',
    }),
    ApiQuery({
      name: 'ids',
      type: Array,
      required: false,
      description:
        'Выбрать конкретные номера карт для получения истории по ним или оставить пустым',
    }),
    ApiQuery({ name: 'skip', type: Number, required: false }),
    ApiQuery({
      name: 'take',
      type: Number,
      required: false,
      description: 'Максимум 100 записей',
    }),
    ApiQuery({
      name: 'order',
      enum: OrderType,
      required: false,
      description: 'сортировка по timestamp, ASC|DESC',
    }),
    ApiQuery({
      name: 'watchBids',
      type: Boolean,
      required: false,
      description: 'показ бидов',
    }),
    ApiQuery({
      name: 'count',
      type: Boolean,
      required: false,
      description: 'число записей',
    }),
  )
  @Auth()
  @UseGuards(NftCountGuard)
  @Get('getSaleAndMintHistory')
  async getSaleAndMintHistory(
    @Query('byOrder') byOrder: string,
    @Query('ids') ids: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('order') order: OrderType,
    @Query('watchBids') watchBids: string,
    @Query('count') count: string,
  ) {
    return this.eventsService.getSaleAndMintHistory(
      queryToBoolean(byOrder),
      queryToArray(ids).map(id => queryToNumber(id)),
      queryToNumber(skip),
      Math.min(100, queryToNumber(take)),
      order,
      watchBids,
      queryToBoolean(count),
    );
  }

  @applyDecorators(
    ApiOperation({ summary: 'Возвращает историю ставок' }),
    ApiQuery({
      name: 'byOrder',
      type: Boolean,
      required: false,
      description: 'Поиск по ордерам, если true, иначе по токенам',
    }),
    ApiQuery({
      name: 'ids',
      type: Array,
      required: false,
      description:
        'Выбрать конкретные номера карт для получения истории по ним или оставить пустым',
    }),
    ApiQuery({ name: 'skip', type: Number, required: false }),
    ApiQuery({
      name: 'take',
      type: Number,
      required: false,
      description: 'Максимум 100 записей',
    }),
    ApiQuery({
      name: 'count',
      type: Boolean,
      required: false,
      description: 'Вывести кол-во записей',
    }),
    ApiQuery({
      name: 'name',
      type: Array,
      required: false,
      description: 'Названия событий',
    }),
    ApiQuery({
      name: 'active',
      type: Boolean,
      required: false,
      description: 'статус активности',
    }),
    ApiQuery({
      name: 'order',
      enum: OrderType,
      required: false,
      description: 'сортировка по timestamp, ASC|DESC',
    }),
  )
  @Auth()
  @UseGuards(NftCountGuard)
  @Get('getBidHistory')
  async getBidHistory(
    @Query('byOrder') byOrder: string,
    @Query('ids') ids: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('count') count: string,
    @Query('name') name: string,
    @Query('active') active: string,
    @Query('order') order: OrderType,
  ) {
    return this.eventsService.getBidHistory(
      queryToBoolean(byOrder, false),
      queryToArray(ids).map(id => queryToNumber(id)),
      queryToNumber(skip),
      Math.min(100, queryToNumber(take)),
      queryToBoolean(count, false),
      queryToArray(name),
      queryToBoolean(active, undefined),
      order,
    );
  }

  @Auth()
  @UseGuards(NftCountGuard)
  @Get('getActualOrderSale')
  @applyDecorators(
    ApiOperation({
      summary: 'Возвращает актуальные продажи по ордерам или по номерам карт',
    }),

    ApiQuery({
      name: 'byOrder',
      type: Boolean,
      required: false,
      description: 'Поиск по ордерам, если true, иначе по токенам',
    }),
    ApiQuery({
      name: 'ids',
      type: Array,
      required: false,
      description:
        'Выбрать конкретные номера карт для получения истории по ним или оставить пустым',
    }),
    ApiQuery({
      name: 'addressSeller',
      type: String,
      required: false,
      description: 'Адрес продавца (создатель заявки)',
    }),
    ApiQuery({
      name: 'active',
      type: Boolean,
      description:
        'Фильтрует активные или неактивные заявки, если оставить пустым - отправит все',
      required: false,
    }),
    ApiQuery({
      name: 'take',
      type: Number,
      description: 'Сколько записей показать',
      required: false,
    }),
    ApiQuery({
      name: 'skip',
      type: Number,
      description: 'Сколько записей пропустить',
      required: false,
    }),
    ApiQuery({
      name: 'order',
      type: String,
      required: false,
      description: 'ASC / DESC',
    }),
    ApiQuery({
      name: 'count',
      type: Boolean,
      required: false,
      description: 'Вывести кол-во записей',
    }),
  )
  async getActualOrderSale(
    @Query('byOrder') byOrder: string,
    @Query('ids') ids: string | string[],
    @Query('addressSeller') addressSeller: string,
    @Query('active') active: string,
    @Query('take') take: string,
    @Query('skip') skip: string,
    @Query('order') order: string,
    @Query('count') count: string,
  ) {
    const sale = await this.eventsService.getActualOrderSale(
      queryToBoolean(byOrder, false),
      queryToArray(ids).map(id => queryToNumber(id)),
      addressSeller,
      queryToBoolean(active),
      Math.min(100, queryToNumber(take)),
      queryToNumber(skip),
      <OrderType>order,
      queryToBoolean(count, false),
    );
    console.log(sale);
    return sale;
  }

  @Auth()
  @UseGuards(NftCountGuard)
  @Get('getActualOrderBids')
  @applyDecorators(
    ApiOperation({
      summary: 'Возвращает актуальные ставки по ордерам или по номерам карт',
    }),

    ApiQuery({
      name: 'byOrder',
      type: Boolean,
      required: false,
      description: 'Поиск по ордерам, если true, иначе по токенам',
    }),
    ApiQuery({
      name: 'ids',
      type: Array,
      required: false,
      description:
        'Выбрать конкретные номера карт для получения истории по ним или оставить пустым',
    }),
    ApiQuery({
      name: 'addressSeller',
      type: String,
      required: false,
      description: 'Адрес продавца (создатель заявки)',
    }),
    ApiQuery({
      name: 'active',
      type: Boolean,
      description:
        'Фильтрует активные или неактивные заявки, если оставить пустым - отправит все',
      required: false,
    }),
    ApiQuery({
      name: 'take',
      type: Number,
      description: 'Сколько записей показать',
      required: false,
    }),
    ApiQuery({
      name: 'skip',
      type: Number,
      description: 'Сколько записей пропустить',
      required: false,
    }),
    ApiQuery({
      name: 'order',
      type: String,
      required: false,
      description: 'ASC / DESC',
    }),
    ApiQuery({
      name: 'count',
      type: Boolean,
      required: false,
      description: 'Вывести кол-во записей',
    }),
  )
  async getActualOrderBids(
    @Query('byOrder') byOrder: string,
    @Query('ids') ids: string | string[],
    @Query('addressSeller') addressSeller: string,
    @Query('active') active: string,
    @Query('take') take: string,
    @Query('skip') skip: string,
    @Query('order') order: string,
    @Query('count') count: string,
  ) {
    return this.eventsService.getActualOrderBids(
      queryToBoolean(byOrder),
      queryToArray(ids).map(id => queryToNumber(id)),
      addressSeller,
      queryToBoolean(active, undefined),
      Math.min(100, queryToNumber(take)),
      queryToNumber(skip),
      <OrderType>order,
      queryToBoolean(count),
    );
  }

  @Auth()
  @UseGuards(NftCountGuard)
  @Get('adminPanel')
  @ApiQuery({
    name: 'timestampBefore',
    type: String,
    description: 'Время до (Формат "2022-01-20T17:37:30.267Z")',
    required: false,
  })
  @ApiQuery({
    name: 'timestampAfter',
    type: String,
    description: 'Время после (Формат "2022-01-10T17:37:30.267Z")',
    required: false,
  })
  @ApiQuery({
    name: 'order',
    enum: OrderType,
    description: 'сортировка по дате',
    required: false,
  })
  async adminPanel(
    @Query('timestampBefore') timestampBefore: string,
    @Query('timestampAfter') timestampAfter: string,
    @Query('order') order: OrderType,
    @Res() response: Response,
  ) {
    console.log(timestampBefore, timestampAfter);
    const { fileName, pathFile } = await this.marketplaceService.adminPanel(
      timestampBefore,
      timestampAfter,
      order,
    );

    const fileExists = existsSync(pathFile);
    if (!fileExists) {
      throw new RequestTimeoutException("File isn't ready, try again");
    }

    const stream = createReadStream(pathFile);

    response.set('Content-Disposition', `attachment; filename=${fileName}`);

    stream.pipe(response);
  }
}
