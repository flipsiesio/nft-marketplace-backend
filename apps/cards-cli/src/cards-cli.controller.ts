import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CardsTraits } from './cards-traits';
import { Model } from 'mongoose';
import { Card, CardDocument } from './models/card';
import { CardsGenerate } from './cards-generate';
import { IpfsService } from '@app/common/ipfs';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

@ApiTags('cards')
@Controller('cards')
export class CardsCliController {
  logger = new Logger('CardsController');

  constructor(
    private readonly cardsTraits: CardsTraits,
    @InjectModel(Card.name) private cardRepository: Model<CardDocument>,
    private readonly cardsGenerate: CardsGenerate,
    private readonly ipfs: IpfsService,
  ) {}

  @Get('generate')
  @ApiOkResponse({
    description: `если количество карт(.../cards/count) 7803,
  то значит уже всё сгенерировано и функцию не следует повторно запускать`,
  })
  @ApiQuery({
    name: 'saveContent',
    type: Boolean,
    description: 'сохранить svg в папку',
  })
  @ApiQuery({
    name: 'calcUnique',
    type: Boolean,
    description: 'вычислить уникальность карт',
  })
  @ApiQuery({ name: 'saveDB', type: Boolean, description: 'сохранить в бд' })
  //@ApiQuery({ name: 'saveIpfs', type: Boolean, description: 'сохранить в ipfs' })
  async generate(
    @Query('saveContent') saveContent,
    @Query('calcUnique') calcUnique,
    @Query('saveDB') saveDB,
    //@Query('saveIpfs') saveIpfs,
  ) {
    if (!localStorage.getItem('generate')) {
      if (saveContent == 'true') {
        saveContent = true;
      } else {
        saveContent = false;
      }
      if (calcUnique == 'true') {
        calcUnique = true;
      } else {
        calcUnique = false;
      }
      if (saveDB == 'true') {
        saveDB = true;
      } else {
        saveDB = false;
      }
      //if (saveIpfs == 'true') { saveIpfs = true; } else { saveIpfs = false; }
      const saveIpfs = false;
      this.logger.log({ saveContent, calcUnique, saveDB, saveIpfs });

      localStorage.setItem('generate', 'processing');
      try {
        await this.cardsGenerate.generate(
          saveContent,
          calcUnique,
          saveDB,
          saveIpfs,
        );
      } catch (error) {
        console.log(error);
        localStorage.removeItem('generate');
        throw new HttpException('Error generating', 500);
      }
      localStorage.setItem('generate', 'generated');
      return 'generated!';
    } else {
      return 'Already generating...';
    }
  }

  @Get('fastGenerate')
  @ApiOkResponse({
    description:
      'генерирует небольшое количство карт необходимых для тестирования',
  })
  @ApiQuery({
    name: 'saveContent',
    type: Boolean,
    description: 'сохранить svg в папку',
  })
  @ApiQuery({
    name: 'calcUnique',
    type: Boolean,
    description: 'вычислить уникальность карт',
  })
  @ApiQuery({ name: 'saveDB', type: Boolean, description: 'сохранить в бд' })
  //@ApiQuery({ name: 'saveIpfs', type: Boolean, description: 'сохранить в ipfs' })
  async generateFast(
    @Query('saveContent') saveContent,
    @Query('calcUnique') calcUnique,
    @Query('saveDB') saveDB,
    //@Query('saveIpfs') saveIpfs,
  ) {
    if (!localStorage.getItem('fastGenerate') || true) {
      if (saveContent == 'true') {
        saveContent = true;
      } else {
        saveContent = false;
      }
      if (calcUnique == 'true') {
        calcUnique = true;
      } else {
        calcUnique = false;
      }
      if (saveDB == 'true') {
        saveDB = true;
      } else {
        saveDB = false;
      }
      //if (saveIpfs == 'true') { saveIpfs = true; } else { saveIpfs = false; }
      const saveIpfs = false;
      this.logger.log({ saveContent, calcUnique, saveDB, saveIpfs });

      localStorage.setItem('fastGenerate', 'processing');
      try {
        await this.cardsGenerate.generateFast(
          saveContent,
          calcUnique,
          saveDB,
          saveIpfs,
        );
      } catch (error) {
        console.log(error);
        localStorage.removeItem('fastGenerate');
        throw new HttpException('Error generating', 500);
      }
      localStorage.setItem('fastGenerate', 'generated');
      return 'generated!';
    } else {
      return 'Already generating...';
    }
  }

  // @Get('uploadCardsIpfs')
  // async uploadCardsIpfs() {
  //   //пройтись по всей бд и сохранить карты в неё
  //   const cardInfo = await this.getCard(0);

  //   const card = new Card(cardInfo.name, cardInfo.face, cardInfo.suit);
  //   card.metadata = cardInfo.metadata;

  //   const content = card.getContent();

  //   const added = await this.ipfs.addFile(content);
  //   card.url = added.path;

  //   // обновить в бд карту

  //   return 'Uploaded Cards to Ipfs';
  // }

  @Get('get')
  @ApiOkResponse({
    description: 'Возвращает данные о карте по её номеру, начиная с 0',
  })
  @ApiQuery({ name: 'cardId', type: Number })
  async getCard(@Query('cardId') cardId: number) {
    const count = await this.cardRepository.count({});
    if (cardId < 0 || cardId >= count) {
      throw new HttpException('Карта с таким номером отсутствует в бд', 403);
    }
    const card = await this.cardRepository.findOne({ cardId });

    const jsonCard = JSON.parse(JSON.stringify(card));
    // if (card.metadata.pathContent) {
    //   jsonCard.metadata.content = readFileSync(card.metadata.pathContent, { encoding: 'utf8' });//card.metadata.content.join('');
    //   delete jsonCard.metadata.pathContent;
    // }
    return jsonCard;
  }

  // @Get('find')
  // async findCards(@Query('filter') filter: Object = {}) {
  //   return this.cardRepository.find(filter);
  // }

  @Get('count')
  @ApiOkResponse({ description: 'Возвращает кол-во карт в бд' })
  async countCards() {
    return this.cardRepository.count({});
  }

  // @Get('svg')
  // @ApiOkResponse({ description: 'Возвращает svg карты по её номеру, начиная с 0' })
  // @ApiQuery({ name: 'id', type: Number })
  // async getSvg(@Query('id') id: number) {
  //   const count = await this.cardRepository.count({});
  //   if (id < 0 || id >= count) { throw new HttpException('Карта с таким номером отсутствует в бд', 403); }
  //   const getedCard = await this.getCard(id);
  //   console.log(getedCard.name);
  //   const card = new Card(getedCard.name);
  //   card.getMetadata();
  //   const content = card.original.contentReset();
  //   card.original.metadataReset();
  //   delete card.original;
  //   return Object.assign(card, { content });
  // }

  // @Get('export')
  // async export() {
  //   //Экспорт
  //   return this.cardRepository.find({});
  // }

  @Post('import')
  async import(
    @Body('cardJson') cardJson: string,
    @Body('password') password: string,
  ) {
    //Импорт бд карт
    if (password != '12345678abcdef') {
      throw new HttpException('Error password', 403);
    }
    const json = JSON.parse(cardJson);
    if (json?._id?.$oid == undefined) {
      throw new HttpException("Don't exists '_id'", 400);
    }
    if (json?.name == undefined) {
      throw new HttpException("Don't exists 'name'", 400);
    }
    if (json?.face == undefined) {
      throw new HttpException("Don't exists 'face'", 400);
    }
    if (json?.suit == undefined) {
      throw new HttpException("Don't exists 'suit'", 400);
    }
    if (json?.metadata == undefined) {
      throw new HttpException("Don't exists 'metadata'", 400);
    }
    if (json?.metadata?.faceFrequency == undefined) {
      throw new HttpException("Don't exists 'faceFrequency'", 400);
    }
    if (json?.metadata?.suitFrequency == undefined) {
      throw new HttpException("Don't exists 'suitFrequency'", 400);
    }
    if (json?.metadata?.tears == undefined) {
      throw new HttpException("Don't exists 'tears'", 400);
    }
    if (json?.metadata?.traits == undefined) {
      throw new HttpException("Don't exists 'traits'", 400);
    }
    if (json?.metadata?.content == undefined) {
      throw new HttpException("Don't exists 'content'", 400);
    }
    if (json?.metadata?.url == undefined) {
      throw new HttpException("Don't exists 'url'", 400);
    }
    if (json?.hash == undefined) {
      throw new HttpException("Don't exists 'hash'", 400);
    }
    const card = await this.cardRepository.create(json);
    return card.save();
  }
}
