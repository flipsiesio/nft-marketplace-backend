import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Card, CardDocument } from 'apps/cards-cli/src/models/card';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import * as jsonCards from '../../../../cards.json';
import { CardEntity, CardGroup } from '../events/entities/card.entity';

@Injectable()
export class LoaderService {
  constructor(
    @InjectModel(Card.name) private cardRepository: Model<CardDocument>,
    @InjectRepository(CardEntity)
    private cardRepositoryTypeorm: Repository<CardEntity>,
  ) {
    this.importCards().then(() => {
      console.log('Cards loaded!');
    });
  }

  async importCards() {
    if (
      (<Array<Object>>jsonCards).length <=
        (await this.cardRepository.count()) &&
      (<Array<Object>>jsonCards).length <=
        (await this.cardRepositoryTypeorm.count())
    ) {
      return true;
    }

    return Promise.all(
      (<Array<Card>>jsonCards).map(async jsonCard => {
        const card = new CardEntity();
        card.cardId = jsonCard.cardId;
        card.name = jsonCard.name;
        card.face = jsonCard.face;
        card.suit = jsonCard.suit;
        card.tears = jsonCard.metadata.tears;
        card.url = jsonCard.metadata.url;
        card.traits = jsonCard.metadata.traits;
        card.faceFrequency = jsonCard.metadata.faceFrequency * 100;
        card.suitFrequency = jsonCard.metadata.suitFrequency * 100;
        card.maxRarity = jsonCard.metadata.maxRarity * 100;
        card.mediumRarity = jsonCard.metadata.mediumRarity * 100;
        card.frequencyRarity = jsonCard.metadata.frequencyRarity;
        card.hash = jsonCard.hash;
        card.group = CardGroup.groupCheck(card);

        await this.cardRepositoryTypeorm.save(card).catch(e => {
          console.log(e);
        });
        return true;
      }),
    );
  }
}
