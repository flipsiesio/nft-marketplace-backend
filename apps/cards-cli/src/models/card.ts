/* eslint-disable @typescript-eslint/no-use-before-define */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { Document } from 'mongoose';
import { basename, dirname, join } from 'path';
import { randomRange } from '../functions.util';
import { Color, ColorsTuples } from '../color.service';
import { getMetadataOriginalJack } from './jack';
import { getMetadataOriginalJoker } from './joker';
import { getMetadataOriginalKing } from './king';
import { getMetadataOriginalQueen } from './queen';
import { createHash } from 'crypto';
import { Trait } from './card-trait';

export type MatchedIndex = { matched: string; length: number; index: number };
export function matchIndex(str: string, regexp: RegExp): Array<MatchedIndex> {
  //Поиск всех вхождений с индексом и длинной
  const results: Array<MatchedIndex> = [];
  for (let i = 0; i < str.length; i++) {
    const substr = str.slice(i);
    const result = substr.match(regexp);

    if (result) {
      const matched = result[0];
      const index = result.index;

      results.push({ matched, length: matched.length, index: i + index });
      i += matched.length - 1;
    } else {
      return results;
    }
  }
  return results;
}

export enum Faces {
  Jack = 'Jack',
  Queen = 'Queen',
  King = 'King',
  Joker = 'Joker',
}

//Масти
export enum Suits {
  Clubs = 'Clubs',
  Diamonds = 'Diamonds',
  Hearts = 'Hearts',
  Spades = 'Spades',
  Red = 'Red',
  Black = 'Black',
}

export interface Metadata {
  url?: string;
  rarity?: number;
  faceFrequency: number;
  suitFrequency: number;
  tears: boolean;

  maxRarity?: number;
  mediumRarity?: number;
  frequencyRarity?: number;

  //traitsGenerator?: Object,
  traits: Record<string, Trait>;

  content?: string;

  //pathContent?: string;

  //content?: Array<string>;
  //content2?: Array<string>;
}

// let maxL = mainHSL.l;
// let maxS = mainHSL.s;
// for (const partName in this.parts) {
//   const partColor = this.parts[partName];
//   const partHSL = partColor.getHSL();
//     maxL = Math.max(maxL, partHSL.l);
//     maxS = Math.max(maxS, partHSL.s);
// }

// let oS = maxS / mainHSL.s;
// let oL = maxL / mainHSL.l;
//displaceHSL(displace);
//console.log('before: ', partColor);
//const s = maxL / partHSL.l;
//console.log(s, hsl.l + colorHSL.l, partHSL.l + colorHSL.l * s);
//oS = maxS / partHSL.s;
//oL = maxL / partHSL.l;
// partHSL.h + displace.h,
// partHSL.s + displace.s * oS, //partHSL.s + colorHSL.s,
// partHSL.l + displace.l * oL, //Math.max(Math.min(partHSL.l + colorHSL.l * s, 1), 0),
//console.log('after: ', partColor);
//partColor.displaceHSL(colorHSL);

@Schema()
export class Card {
  // @Prop()
  // id: ObjectId;

  @Prop({ unique: true })
  cardId?: number;

  @Prop()
  name: CardsNames;

  @Prop()
  face: Faces;

  @Prop()
  suit: Suits;

  @Prop({ type: Object })
  metadata: Metadata;

  //@Prop({ type: String, unique: true })
  description: string;

  @Prop({ type: String, unique: true })
  hash: string;

  @Prop({ type: String, required: false })
  price?: string;

  @Prop({ required: false, type: Object })
  bids?: Object;

  bidsSum?: number;

  original: CardOriginal;

  constructor(name: CardsNames, face?: Faces, suit?: Suits) {
    this.original = cardsOriginal[name];

    const nameInfo = CardsNameInfo[name];
    this.name = name;
    this.face = face || nameInfo.face;
    this.suit = suit || nameInfo.suit;
  }

  getDescription() {
    const { faceFrequency, suitFrequency, traits } = this.metadata;

    let description = `Card Name: ${this.name}\n`;

    description += `Face: ${this.face}, Frequency: ${faceFrequency * 100}%\n`;
    description += `Suit: ${this.suit}, Frequency: ${suitFrequency * 100}%\n`;

    for (const traitName in traits) {
      const trait = traits[traitName];
      description += `Trait: ${trait.main.name}, Color: ${
        trait.main.color.name
      }, Frequency: ${trait.frequency * 100}%\n`;
    }

    let hash = `${this.name}\n`;
    hash += `${this.face}\n`;
    hash += `${this.suit}\n`;
    for (const traitName in traits) {
      const trait = traits[traitName];
      hash += `${trait.main.name} ${trait.main.color.name}\n`;
    }

    this.hash = createHash('md5').update(hash).digest('hex');

    return description;
  }

  cleaning(content: string) {
    return content.replaceAll(/id=".+?"/gi, '');
  }

  getContent(cleaning: boolean = false) {
    //let content = this.original.content;

    const { traits } = this.metadata;
    for (const traitName in traits) {
      const trait = traits[traitName];

      this.original.changeFigureColor(trait.main.name, trait.main.color);

      for (const partName in trait.parts) {
        const partColor = trait.parts[partName];
        this.original.changeFigureColor(partName, partColor); //partColor.displaceHSL(displace);
      }
    }

    if (cleaning) {
      return this.cleaning(this.original.contentReset());
    } else {
      return this.original.contentReset();
    }
  }

  loadOriginalCard(name: CardsNames) {
    //Загружаем карту с указанным именем
    const originalCardPath = join(__dirname, '/original/', name + '.svg');
    if (!existsSync(originalCardPath)) {
      console.log(`Not exists Original Card path: ${originalCardPath}`);
      return;
    }
    const originalCard = readFileSync(originalCardPath)
      .toString()
      .replaceAll(/[\r\n]/gi, '');
    return originalCard;
  }

  getMetadata() {
    //this.loadOriginalCard(this.name);
    this.metadata = this.original.metadata;
    this.description = this.getDescription();
    return this.metadata;
  }

  save(name?: string) {
    this.saveContent(name);
    this.saveDescription(name);
    this.saveMetadata(name);
  }

  saveContent(name?: string, force = false) {
    const dir = dirname(join(__dirname, '/collect/' + name));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const bname = basename(name || this.name);
    let path = join(dir, bname + '.svg');
    if (!force) {
      let i = 0;
      while (existsSync(path)) {
        path = join(dir, bname + '-' + i++ + '.svg');
      }
    }
    writeFileSync(path, this.getContent(true)); //this.content);
    //this.metadata.pathContent = path;
  }

  saveDescription(name?: string) {
    const dir = join(__dirname, '/collect');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(
      join(dir, (name || this.name) + '.txt'),
      this.getDescription(),
    );
  }

  saveMetadata(name?: string) {
    const dir = join(__dirname, '/collect');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(
      join(dir, (name || this.name) + '.json'),
      JSON.stringify(this.metadata),
    );
  }
}

export class CardOriginal extends Card {
  contentOriginal: string;
  content: string;

  constructor(name: CardsNames, face?: Faces, suit?: Suits) {
    super(name, face, suit);
    this.original = this;
    // this.contentOriginal = this.content;
  }

  getFigureColor(
    groupName: string,
    error = true,
    nearest = true /*, oneColor = true*/,
  ) {
    let cardContent: string = this.content.replaceAll(/[\n\r]/gi, ''); // Чистим от переносов

    //Ищем нужную группу
    const regexpGroup = new RegExp(
      `<g id="${groupName}">(?<group>.+?)</g>`,
      'i',
    );
    const group = cardContent.match(regexpGroup);

    if (!group) {
      if (error) {
        throw new Error(`Doesn't exist group name: ${groupName}`);
      } else {
        return new Color('000000', 'black', true, false);
      }
    }

    const figureColors = group[0].matchAll(/fill="(?<color>.+?)"/gi);
    // if (!figureColors) {
    //   return new Color('000000', 'black', true, false);
    // }
    //if (oneColor) {
    let color = Array.from(figureColors)[0]?.groups.color;
    if (color == undefined) {
      return new Color('000000', 'black', true, false);
    }
    if (color[0] == '#') {
      color = color.slice(1);

      if (nearest) {
        return new Color(color, undefined, true, false);
      }
      return new Color(color, 'undefined', true, false);
    } else {
      //Если название цвета
      const ncolor: Color = ColorsTuples[color]();
      ncolor.mutableName = true;
      ncolor.mutableColor = false;
      return ncolor;
    }
    //}

    //return Array.from(figureColors);
  }

  deleteFigure(traitGroup: string) {
    let cardContent: string = this.content.replaceAll(/[\n\r]/gi, ''); // Чистим от переносов

    //Ищем нужную группу
    const regexpGroup = new RegExp(
      `(?<matched><g id="${traitGroup}">(?<group>.+?)</g id="${traitGroup}">)`,
      'ig',
    );
    const groups = Array.from(cardContent.matchAll(regexpGroup)); //matchIndex(cardContent, regexpGroup);

    //fslog(groups);
    //console.log('deleteFigure count: ', groups.length);

    //Производим все замены
    for (let i = groups.length - 1; i >= 0; i--) {
      const group = groups[i];
      const matched = group.groups.matched;
      cardContent =
        cardContent.slice(0, group.index) +
        cardContent.slice(group.index + matched.length);
    }

    //Вносим изменения в карту
    this.content = cardContent;
  }

  changeFigureColor(traitGroup: string, color: Color) {
    let cardContent: string = this.content.replaceAll(/[\n\r]/gi, ''); // Чистим от переносов

    //Ищем нужную группу
    const regexpGroup = new RegExp(
      `<g id="${traitGroup}">(?<group>.+?)</g>`,
      'i',
    );
    const groups = matchIndex(cardContent, regexpGroup);

    //Создаём группу замены (цвет на который хотим что-то поменять)
    const groupsReplace = [];
    groups.forEach(group => {
      groupsReplace.push(
        group.matched.replaceAll(
          /fill="(?<color>.+?)"/gi,
          `fill="#${color.getColor()}"`,
        ),
      );
    });

    //Производим все замены
    for (let i = groups.length - 1; i >= 0; i--) {
      const group = groups[i];
      const groupReplace = groupsReplace[i];

      cardContent =
        cardContent.slice(0, group.index) +
        groupReplace +
        cardContent.slice(group.index + group.length);
    }

    //Вносим изменения в карту
    this.content = cardContent;
  }

  metadataRandomTraits(
    options: { tears?: boolean; data?: unknown } = { tears: false },
  ) {
    let i = 0;
    const traits = this.metadata.traits;
    for (const traitName in traits) {
      //if (traitName == 'suit') { continue; }
      const trait = traits[traitName];
      const generator = trait.main.generator;
      if (generator) {
        generator(trait, options.data, i);
      } else {
        trait.displaceHSL({
          dh: { min: 0, max: 1 },
          s: Math.random() * (1.5 + (traitName == 'suit' ? 2 : 0)),
          l: randomRange(0.7, 1.25 + (traitName == 'suit' ? 1 : 0)),
        });
        //trait.displaceHSL({ h: 1, s: 1.5, l: 1.25 });
      }
      i++;
    }
    const s = randomRange(0, 1);
    const l = randomRange(s, 1);
    this.metadata.traits.background.main.color.setHSL(Math.random(), s, l);

    if (l - s * 0.25 < 0.5) {
      this.metadata.traits.suit.displaceHSL({
        h: 1,
        s: Math.random() * 10,
        l: 1 + 1 * Math.random(),
      });
    }

    if (!options.tears) {
      this.deleteFigure('drop');
    }

    // for (const traitName in this.metadata.traitsGenerator) {
    //   const colors = this.metadata.traitsGenerator[traitName];

    //   if (colors) {
    //     this.metadata.traits[traitName].main.color = new Color(
    //       colors[Math.floor(Math.random() * colors.length)][0],
    //     );
    //   }

    // }
  }

  contentReset() {
    const content = this.content;
    this.content = this.contentOriginal;
    return content;
  }

  metadataReset() {
    this.metadata = getMetadataOriginal(this);
  }

  // changeTraitColor(traitName: string, color: Color) {
  //   const trait: Trait = this.metadata[traitName];
  //   trait.main = color;
  // }

  // insertCardTrait(card: Card, insertTrait: string) {
  //   let cardContent = card.content;
  // }
}

// export class CardOriginalJack extends CardJack {}
// export class CardOriginalQueen extends CardJack {}
// export class CardOriginalKing extends CardJack {}
// export class CardOriginalJoker extends CardJack {}

//Названия карт
export enum CardsNames {
  jackOfClubs = 'jack-of-clubs',
  jackOfDiamonds = 'jack-of-diamonds',
  jackOfHearts = 'jack-of-hearts',
  jackOfSpades = 'jack-of-spades',

  queenOfClubs = 'queen-of-clubs',
  queenOfDiamonds = 'queen-of-diamonds',
  queenOfHearts = 'queen-of-hearts',
  queenOfSpades = 'queen-of-spades',

  kingOfClubs = 'king-of-clubs',
  kingOfDiamonds = 'king-of-diamonds',
  kingOfHearts = 'king-of-hearts',
  kingOfSpades = 'king-of-spades',

  jokerRed = 'joker-red',
  jokerBlack = 'joker-black',

  uJackOfDiamonds = 'unique-jack-of-diamonds',
  uJackOfHearts = 'unique-jack-of-hearts',
  uJackOfSpades = 'unique-jack-of-spades',

  uQueenOfClubs = 'unique-queen-of-clubs',
  uQueenOfSpades = 'unique-queen-of-spades',

  uKingOfDiamonds = 'unique-king-of-diamonds',
  uKingOfHearts = 'unique-king-of-hearts',
}

export const CardsNameInfo = {
  [CardsNames.jackOfClubs]: {
    name: CardsNames.jackOfClubs,
    face: Faces.Jack,
    suit: Suits.Clubs,
  },
  [CardsNames.jackOfDiamonds]: {
    name: CardsNames.jackOfDiamonds,
    face: Faces.Jack,
    suit: Suits.Diamonds,
  },
  [CardsNames.jackOfHearts]: {
    name: CardsNames.jackOfHearts,
    face: Faces.Jack,
    suit: Suits.Hearts,
  },
  [CardsNames.jackOfSpades]: {
    name: CardsNames.jackOfSpades,
    face: Faces.Jack,
    suit: Suits.Spades,
  },
  [CardsNames.queenOfClubs]: {
    name: CardsNames.queenOfClubs,
    face: Faces.Queen,
    suit: Suits.Clubs,
  },
  [CardsNames.queenOfDiamonds]: {
    name: CardsNames.queenOfDiamonds,
    face: Faces.Queen,
    suit: Suits.Diamonds,
  },
  [CardsNames.queenOfHearts]: {
    name: CardsNames.queenOfHearts,
    face: Faces.Queen,
    suit: Suits.Hearts,
  },
  [CardsNames.queenOfSpades]: {
    name: CardsNames.queenOfSpades,
    face: Faces.Queen,
    suit: Suits.Spades,
  },
  [CardsNames.kingOfClubs]: {
    name: CardsNames.kingOfClubs,
    face: Faces.King,
    suit: Suits.Clubs,
  },
  [CardsNames.kingOfDiamonds]: {
    name: CardsNames.kingOfDiamonds,
    face: Faces.King,
    suit: Suits.Diamonds,
  },
  [CardsNames.kingOfHearts]: {
    name: CardsNames.kingOfHearts,
    face: Faces.King,
    suit: Suits.Hearts,
  },
  [CardsNames.kingOfSpades]: {
    name: CardsNames.kingOfSpades,
    face: Faces.King,
    suit: Suits.Spades,
  },
  [CardsNames.jokerRed]: {
    name: CardsNames.jokerRed,
    face: Faces.Joker,
    suit: Suits.Red,
  },
  [CardsNames.jokerBlack]: {
    name: CardsNames.jokerBlack,
    face: Faces.Joker,
    suit: Suits.Black,
  },

  [CardsNames.uJackOfDiamonds]: {
    name: CardsNames.uJackOfDiamonds,
    face: Faces.Jack,
    suit: Suits.Diamonds,
  },
  [CardsNames.uJackOfHearts]: {
    name: CardsNames.uJackOfHearts,
    face: Faces.Jack,
    suit: Suits.Hearts,
  },
  [CardsNames.uJackOfSpades]: {
    name: CardsNames.uJackOfSpades,
    face: Faces.Jack,
    suit: Suits.Spades,
  },

  [CardsNames.uQueenOfClubs]: {
    name: CardsNames.uQueenOfClubs,
    face: Faces.Queen,
    suit: Suits.Clubs,
  },
  [CardsNames.uQueenOfSpades]: {
    name: CardsNames.uQueenOfSpades,
    face: Faces.Queen,
    suit: Suits.Spades,
  },

  [CardsNames.uKingOfDiamonds]: {
    name: CardsNames.uKingOfDiamonds,
    face: Faces.King,
    suit: Suits.Diamonds,
  },
  [CardsNames.uKingOfHearts]: {
    name: CardsNames.uKingOfHearts,
    face: Faces.King,
    suit: Suits.Hearts,
  },
};

interface ICardsOriginal {
  [CardsNames.jackOfClubs]?: CardOriginal;
  [CardsNames.jackOfDiamonds]?: CardOriginal;
  [CardsNames.jackOfHearts]?: CardOriginal;
  [CardsNames.jackOfSpades]?: CardOriginal;
  [CardsNames.queenOfClubs]?: CardOriginal;
  [CardsNames.queenOfDiamonds]?: CardOriginal;
  [CardsNames.queenOfHearts]?: CardOriginal;
  [CardsNames.queenOfSpades]?: CardOriginal;
  [CardsNames.kingOfClubs]?: CardOriginal;
  [CardsNames.kingOfDiamonds]?: CardOriginal;
  [CardsNames.kingOfHearts]?: CardOriginal;
  [CardsNames.kingOfSpades]?: CardOriginal;
  [CardsNames.jokerRed]?: CardOriginal;
  [CardsNames.jokerBlack]?: CardOriginal;

  [CardsNames.uJackOfDiamonds]?: CardOriginal;
  [CardsNames.uJackOfHearts]?: CardOriginal;
  [CardsNames.uJackOfSpades]?: CardOriginal;
  [CardsNames.uQueenOfClubs]?: CardOriginal;
  [CardsNames.uQueenOfSpades]?: CardOriginal;
  [CardsNames.uKingOfDiamonds]?: CardOriginal;
  [CardsNames.uKingOfHearts]?: CardOriginal;
}

//Оригинальные карты
export const cardsOriginal: ICardsOriginal = {};

cardsOriginal[CardsNames.jackOfClubs] = new CardOriginal(
  CardsNames.jackOfClubs,
);
//cardsOriginal[CardsNames.jackOfClubs].original = cardsOriginal[CardsNames.jackOfClubs];
cardsOriginal[CardsNames.jackOfDiamonds] = new CardOriginal(
  CardsNames.jackOfDiamonds,
);
cardsOriginal[CardsNames.jackOfHearts] = new CardOriginal(
  CardsNames.jackOfHearts,
);
cardsOriginal[CardsNames.jackOfSpades] = new CardOriginal(
  CardsNames.jackOfSpades,
);
cardsOriginal[CardsNames.queenOfClubs] = new CardOriginal(
  CardsNames.queenOfClubs,
);
cardsOriginal[CardsNames.queenOfDiamonds] = new CardOriginal(
  CardsNames.queenOfDiamonds,
);
cardsOriginal[CardsNames.queenOfHearts] = new CardOriginal(
  CardsNames.queenOfHearts,
);
cardsOriginal[CardsNames.queenOfSpades] = new CardOriginal(
  CardsNames.queenOfSpades,
);
cardsOriginal[CardsNames.kingOfClubs] = new CardOriginal(
  CardsNames.kingOfClubs,
);
cardsOriginal[CardsNames.kingOfDiamonds] = new CardOriginal(
  CardsNames.kingOfDiamonds,
);
cardsOriginal[CardsNames.kingOfHearts] = new CardOriginal(
  CardsNames.kingOfHearts,
);
cardsOriginal[CardsNames.kingOfSpades] = new CardOriginal(
  CardsNames.kingOfSpades,
);
cardsOriginal[CardsNames.jokerRed] = new CardOriginal(CardsNames.jokerRed);
cardsOriginal[CardsNames.jokerBlack] = new CardOriginal(CardsNames.jokerBlack);

cardsOriginal[CardsNames.uJackOfDiamonds] = new CardOriginal(
  CardsNames.uJackOfDiamonds,
);
cardsOriginal[CardsNames.uJackOfHearts] = new CardOriginal(
  CardsNames.uJackOfHearts,
);
cardsOriginal[CardsNames.uJackOfSpades] = new CardOriginal(
  CardsNames.uJackOfSpades,
);
cardsOriginal[CardsNames.uQueenOfClubs] = new CardOriginal(
  CardsNames.uQueenOfClubs,
);
cardsOriginal[CardsNames.uQueenOfSpades] = new CardOriginal(
  CardsNames.uQueenOfSpades,
);
cardsOriginal[CardsNames.uKingOfDiamonds] = new CardOriginal(
  CardsNames.uKingOfDiamonds,
);
cardsOriginal[CardsNames.uKingOfHearts] = new CardOriginal(
  CardsNames.uKingOfHearts,
);

export function getMetadataOriginal(card: Card, face?: Faces, suit?: Suits) {
  return {
    [Faces.Jack]: getMetadataOriginalJack,
    [Faces.Queen]: getMetadataOriginalQueen,
    [Faces.King]: getMetadataOriginalKing,
    [Faces.Joker]: getMetadataOriginalJoker,
  }[face || card.face](card, suit);
}

export type CardDocument = Card & Document;
export const SchemaCard = SchemaFactory.createForClass(Card);
