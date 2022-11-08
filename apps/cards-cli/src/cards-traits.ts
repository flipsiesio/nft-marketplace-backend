import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Model } from 'mongoose';
import {
  CardDocument,
  Card,
  CardsNames,
  cardsOriginal,
  CardOriginal,
  getMetadataOriginal,
} from './models/card';

//import { CardJack } from './models/jack';

// function escapeRegExp(str: string) {
//   return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }

// function replaceAll(str: string, match: string, replacement) {
//   return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
// }

////??????????????
// export type MatchedIndex = { matched: string, length: number, index: number };
// export function matchIndex(str: string, regexp: RegExp): Array<MatchedIndex> {
//   //Поиск всех вхождений с индексом и длинной
//   const results: Array<MatchedIndex> = [];
//   for (let i = 0; i < str.length; i++) {
//     const substr = str.slice(i);
//     const result = substr.match(regexp);

//     if (result) {
//       const matched = result[0];
//       const index = result.index;

//       results.push({ matched, length: matched.length, index: i + index });
//       i += matched.length - 1;
//     } else {
//       return results;
//     }
//   }
//   return results;
// }

// interface Trait extends Color {
//   rare: number;
// }

// //Названия карт
// export enum CardsNames {
//   jackOfClubs = 'jack-of-clubs',
//   jackOfDiamonds = 'jack-of-diamonds',
//   jackOfHearts = 'jack-of-hearts',
//   jackOfSpades = 'jack-of-spades',

//   queenOfClubs = 'queen-of-clubs',
//   queenOfDiamonds = 'queen-of-diamonds',
//   queenOfHearts = 'queen-of-hearts',
//   queenOfSpades = 'queen-of-spades',

//   kingOfClubs = 'king-of-clubs',
//   kingOfDiamonds = 'king-of-diamonds',
//   kingOfHearts = 'king-of-hearts',
//   kingOfSpades = 'king-of-spades',

//   jokerRed = 'joker-red',
//   jokerBlack = 'joker-black',
// }

// //Оригинальные карты
// export const cardsOriginal = {
//   [CardsNames.jackOfClubs]: { name: CardsNames.jackOfClubs, face: Faces.Jack, suit: Suits.Clubs, content: '' },
//   [CardsNames.jackOfDiamonds]: { name: CardsNames.jackOfDiamonds, face: Faces.Jack, suit: Suits.Diamonds, content: '' },
//   [CardsNames.jackOfHearts]: { name: CardsNames.jackOfHearts, face: Faces.Jack, suit: Suits.Hearts, content: '' },
//   [CardsNames.jackOfSpades]: { name: CardsNames.jackOfSpades, face: Faces.Jack, suit: Suits.Spades, content: '' },

//   [CardsNames.queenOfClubs]: { name: CardsNames.queenOfClubs, face: Faces.Queen, suit: Suits.Clubs, content: '' },
//   [CardsNames.queenOfDiamonds]: { name: CardsNames.queenOfDiamonds, face: Faces.Queen, suit: Suits.Diamonds, content: '' },
//   [CardsNames.queenOfHearts]: { name: CardsNames.queenOfHearts, face: Faces.Queen, suit: Suits.Hearts, content: '' },
//   [CardsNames.queenOfSpades]: { name: CardsNames.queenOfSpades, face: Faces.Queen, suit: Suits.Spades, content: '' },

//   [CardsNames.kingOfClubs]: { name: CardsNames.kingOfClubs, face: Faces.King, suit: Suits.Clubs, content: '' },
//   [CardsNames.kingOfDiamonds]: { name: CardsNames.kingOfDiamonds, face: Faces.King, suit: Suits.Diamonds, content: '' },
//   [CardsNames.kingOfHearts]: { name: CardsNames.kingOfHearts, face: Faces.King, suit: Suits.Hearts, content: '' },
//   [CardsNames.kingOfSpades]: { name: CardsNames.kingOfSpades, face: Faces.King, suit: Suits.Spades, content: '' },

//   [CardsNames.jokerRed]: { name: CardsNames.jokerRed, face: Faces.Joker, suit: Suits.Red, content: '' },
//   [CardsNames.jokerBlack]: { name: CardsNames.jokerBlack, face: Faces.Joker, suit: Suits.Black, content: '' },
// };

// export class Card {
//   name: CardsNames;
//   face: Faces;
//   suit: Suits;
//   content: string;

//   constructor(name: CardsNames, suit: Suits) {
//     this.name = name;
//     this.suit = suit;
//     this.content = cardsOriginal[name].content;
//   }

//   changeTraitColor(traitGroup: string, color: Colors) {
//     let cardContent: string = this.content.replaceAll(/[\n\r]/gi, ''); // Чистим от переносов

//     //Ищем нужную группу
//     const regexpGroup = new RegExp(`<g id="${traitGroup}">(?<group>.+?)</g>`, 'i');
//     const groups = matchIndex(cardContent, regexpGroup);

//     //Создаём группу замены (цвет на который хотим что-то поменять)
//     const groupsReplace = [];
//     groups.forEach((group) => {
//       groupsReplace.push(
//         group.matched.replaceAll(/fill="(?<color>.+?)"/gi, `fill="#${color}"`),
//       );
//     });

//     //Производим все замены
//     for (let i = groups.length - 1; i >= 0; i--) {
//       const group = groups[i];
//       const groupReplace = groupsReplace[i];

//       cardContent =
//         cardContent.slice(0, group.index) +
//         groupReplace +
//         cardContent.slice(group.index + group.length);
//     }

//     //Вносим изменения в карту
//     this.content = cardContent;
//   }

//   insertCardTrait(card: Card, insertTrait: string) {
//     let cardContent = card.content;
//   }

//   save(name?: string) {
//     const dir = join(__dirname, '/collect/');
//     if (!existsSync(dir)) {
//       mkdirSync(dir, { recursive: true });
//     }
//     writeFileSync(join(dir, (name || this.name) + '.svg'), this.content);
//   }

//   saveMetadata(name?: string) {}
// }

// export class CardJack extends Card {
//   metadata: {
//     traitBackground: Trait;
//   };
// }

// export class CardQueen extends Card {
//   metadata: {
//     traitBackground: Trait;
//   };
// }

// export class CardKing extends Card {
//   metadata: {
//     traitBackground: Trait;
//   };
// }

// export class CardJoker extends Card {
//   metadata: {
//     traitBackground: Trait;
//     traitBackgroundDecor: Trait;
//   };
// }

@Injectable()
export class CardsTraits {
  cardsLogger = new Logger('cards-traits');
  constructor(
    @InjectModel(Card.name) private cardRepository: Model<CardDocument>,
  ) {
    //this.loadOriginalCards();
    //console.log(card.getFigureColor('background'));
    //card.changeTraitColor();
    // this.cardRepository.create(card);
    // card.saveContent();
    // console.log(card);
  }

  loadOriginalCard(name: CardsNames) {
    //Загружаем карту с указанным именем
    const originalCardPath = join(__dirname, '/original/', name + '.svg');
    if (!existsSync(originalCardPath)) {
      this.cardsLogger.log(
        `Not exists Original Card path: ${originalCardPath}`,
      );
      return;
    }
    const originalCard = readFileSync(originalCardPath)
      .toString()
      .replaceAll(/[\r\n]/gi, '');
    return originalCard;
  }

  loadOriginalCards() {
    //Загружаем все карты
    for (const cardName in cardsOriginal) {
      const cardOriginal: CardOriginal = cardsOriginal[cardName];
      const content = this.loadOriginalCard(cardOriginal.name);
      this.cardsLogger.log(cardName);
      cardOriginal.contentOriginal = content;
      cardOriginal.content = content;

      cardOriginal.metadata = getMetadataOriginal(cardOriginal);
      //console.log(cardOriginal.metadata);

      // switch (cardOriginal.face) {
      //   case Faces.Jack: { cardOriginal.metadata = getMetadataCardJack.call(cardOriginal); break; }
      //   // case Faces.Queen: { this.metadata = getMetadataCardQueen(this); break; }
      //   // case Faces.King: { this.metadata = getMetadataCardKing(this); break; }
      //   // case Faces.Joker: { this.metadata = getMetadataCardJoker(this); break; }
      // }

      // const card = new CardJack(cardOriginal.name, Suits.Clubs);
      // card.changeTraitColor('background', Colors.orange);//'#08af08');
      // card.save();
    }
  }
}

// interface ICardJack extends ICard {
//   metadata?: {
//     traitBackground: Trait;
//   }
// }
// interface ICardQueen extends ICard {
//   metadata?: {
//     traitBackground: Trait;
//   }
// }
// interface ICardKing extends ICard {
//   metadata?: {
//     traitBackground: Trait;
//   }
// }
// interface ICardJoker extends ICard {
//   metadata?: {
//     traitBackground: Trait;
//     traitBackgroundDecor: Trait;
//   }
// }

// createCard(cardName: CardsNames) {
//   //Создаём клон из оригинальной карты
//   const { name, face, suit, content } = cardsOriginal[cardName];
//   switch (face) {
//     case Faces.Jack: {
//       const card = new CardJack(name, suit);
//       card.content = content;
//       return card;
//     }
//     case Faces.Queen: {
//       const card = new CardQueen(name, suit);
//       card.content = content;
//       return card;
//     }
//     case Faces.King: {
//       const card = new CardKing(name, suit);
//       card.content = content;
//       return card;
//     }
//     case Faces.Joker: {
//       const card = new CardJoker(name, suit);
//       card.content = content;
//       return card;
//     }
//   }
//   //return { ...this.cardsOriginal[cardName] };
// }

// changeCardTraitColor(card: Card, traitGroup: string, color: string): Card {
//   let cardContent: string = card.content.replaceAll(/[\n\r]/gi, ''); // Чистим от переносов

//   //Ищем нужную группу
//   const regexpGroup = new RegExp(`<g id="${traitGroup}">(?<group>.+?)</g>`, 'i');
//   const groups = matchIndex(cardContent, regexpGroup);

//   //Создаём группу замены (цвет на который хотим что-то поменять)
//   const groupsReplace = [];
//   groups.forEach((group) => {
//     groupsReplace.push(
//       group.matched.replaceAll(/fill="(?<color>.+?)"/gi, `fill="${color}"`),
//     );
//   });

//   //Производим все замены
//   for (let i = groups.length - 1; i >= 0; i--) {
//     const group = groups[i];
//     const groupReplace = groupsReplace[i];

//     cardContent = cardContent.slice(0, group.index) + groupReplace + cardContent.slice(group.index + group.length);
//   }

//   //Вносим изменения в карту
//   card.content = cardContent;

//   return card;
// }

// insertCardTrait(card: Card, trait: string) {
//   let cardContent = card.content;

// }

// cardSave(card: Card, name?: string) {
//   const dir = join(__dirname, '/collect/');
//   if (!existsSync(dir)) {
//     mkdirSync(dir, { recursive: true });
//   }
//   writeFileSync(join(dir, (name || card.name) + '.svg'), card.content);
// }

// Данные цветовой палитры и описание карты
// export interface Metadata {
//   description: string;
// }

// export interface MetadataJack extends Metadata {

// }
// export interface MetadataQueen extends Metadata {

// }
// export interface MetadataKing extends Metadata {

// }
// export interface MetadataJoken extends Metadata {
//   background: Color;
// }

// export interface ICard {
//   name: CardsNames;
//   face: Faces;
//   suit: Suits;
//   content?: string;
//   //metadata?: Metadata;
// }

// export interface ICardsOriginal { //????????
//   [CardsNames.jackOfClubs]: CardJack,
//   [CardsNames.jackOfDiamonds]: CardJack,
//   [CardsNames.jackOfHearts]: CardJack,
//   [CardsNames.jackOfSpades]: CardJack,

//   [CardsNames.queenOfClubs]: CardQueen,
//   [CardsNames.queenOfDiamonds]: CardQueen,
//   [CardsNames.queenOfHearts]: CardQueen,
//   [CardsNames.queenOfSpades]: CardQueen,

//   [CardsNames.kingOfClubs]: CardKing,
//   [CardsNames.kingOfDiamonds]: CardKing,
//   [CardsNames.kingOfHearts]: CardKing,
//   [CardsNames.kingOfSpades]: CardKing,

//   [CardsNames.jokerRed]: CardJoker,
//   [CardsNames.jokerBlack]: CardJoker,
// }
