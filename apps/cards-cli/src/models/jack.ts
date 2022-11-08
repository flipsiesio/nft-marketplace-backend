import { randomRange } from '../functions.util';
import { Color } from '../color.service';
import { Card, Metadata, Suits } from './card';
import { Trait } from './card-trait';

// export const ColorsJackClubs = {
//   hair: [
//     ['3B3A37', '282625'],
//     ['49250F', '311809'],
//   ],
//   clothing: [
//     ['DF2208', 'B31A18', '9D0E0C'],
//     ['7D51B7', '5F3796', '492679'],
//     ['1C744A', '124D31', '0C321F'],
//     ['3092ED', '1771C4', '0B5EAB'],
//     ['EADC5D', 'CFB040', 'BD9C27'],
//     ['6F7188', '515369', '3B3D4D'],
//   ],
// };

// export const ColorsJackDiamonds = {
//   hair: [
//     ['AA3F2E', '881A19'],
//     ['F4BF70', 'DEA44D'],
//   ],
//   clothing: [
//     ['DF2208', 'B31A18', '9D0E0C'],
//     ['7D51B7', '5F3796', '492679'],
//     ['90B751', '709631', '5E8224'],
//     ['3092ED', '1771C4', '0B5EAB'],
//     ['EADC5D', 'CFB040', 'BD9C27'],
//   ],
// };

// export const ColorsJackHearts = {
//   hair: [
//     ['9E2708', 'F4BF70'],
//     ['741B07', 'DEA44D'],
//   ],
//   clothing: [
//     ['E82626', 'B41A18', '7E1311'],
//     ['7D51B7', '5F3796', '49257B'],
//     ['90B751', '709631', '597A23'],
//     ['8AA0E8', '40569E', '2F4075'],
//     ['EADC5D', 'CFB040', 'B5972C'],
//   ],
// };

// export const ColorsJackSpades = {
//   hair: [
//     ['282724', '151515'],
//     ['49250F', '311809'],
//   ],
//   clothing: [
//     ['DF2208', 'B31A18'],
//     ['7D51B7', '5F3796'],
//     ['90B751', '709631'],
//     ['3B3DBB', '292B99'],
//     ['EADC5D', 'CFB040'],
//     ['6F7188', '515369'],
//   ],
// };

export interface MetadataJackClubs extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    hair: Trait;
    clothing: Trait;

    //Особая черта
    gold: Trait;
  };
}

export interface MetadataJackDiamonds extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    hair: Trait;
    clothing: Trait;

    //Особая черта
    axe: Trait;
  };
}

export interface MetadataJackHearts extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    hair: Trait;
    clothing: Trait;

    //Особая черта
    spear: Trait;
  };
}

export interface MetadataJackSpades extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    hair: Trait;
    clothing: Trait;

    //Особая черта
    dagger: Trait;
  };
}

export function getMetadataOriginalJackClubs(card: Card): MetadataJackClubs {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsJackClubs,
    traits: {
      background: new Trait({
        name: 'background',
        color: card.original.getFigureColor('background'),
      }),

      suit: new Trait(
        {
          name: 'cardSuit',
          color: card.original.getFigureColor('cardSuit'),
        },
        {
          cardSuitL: card.original.getFigureColor('cardSuitL'),
        },
      ),

      hair: new Trait(
        {
          name: 'hair',
          color: card.original.getFigureColor('hair'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 0, max: 40 / 255 },
              s: randomRange(0, 2),
              l: randomRange(0.7, 1.7),
            });
          },
        },
        {
          hairS: card.original.getFigureColor('hairS'),
        },
      ),

      clothing: new Trait(
        {
          name: 'clothing',
          color: card.original.getFigureColor('clothing'),
        },
        {
          clothingSSS: card.original.getFigureColor('clothingSSS'),
          clothingSS: card.original.getFigureColor('clothingSS'),
          clothingS: card.original.getFigureColor('clothingS'),
          clothingLL: card.original.getFigureColor('clothingLL'),
          clothingL: card.original.getFigureColor('clothingL'),
        },
      ),

      gold: new Trait(
        {
          name: 'gold',
          color: card.original.getFigureColor('gold'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              h: randomRange(-0.05, 0.05),
              s: randomRange(0, 2),
              l: randomRange(1, 1.7),
            });
          },
        },
        {
          goldL: card.original.getFigureColor('goldL'),
          goldLL: card.original.getFigureColor('goldLL'),
          goldS: card.original.getFigureColor('goldS'),
          goldSS: card.original.getFigureColor('goldSS'),
        },
      ),
    },
  };
}

export function getMetadataOriginalJackDiamonds(
  card: Card,
): MetadataJackDiamonds {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsJackDiamonds,
    traits: {
      background: new Trait({
        name: 'background',
        color: card.original.getFigureColor('background'),
      }),

      suit: new Trait(
        {
          name: 'cardSuit',
          color: card.original.getFigureColor('cardSuit'),
        },
        {
          cardSuitL: card.original.getFigureColor('cardSuitL'),
          cardSuitS: card.original.getFigureColor('cardSuitS'),
        },
      ),

      hair: new Trait(
        {
          name: 'hair',
          color: card.original.getFigureColor('hair'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 0, max: 40 / 255 },
              s: randomRange(0, 2),
              l: randomRange(0.7, 1.7),
            });
          },
        },
        {
          hairS: card.original.getFigureColor('hairS'),
        },
      ),

      clothing: new Trait(
        {
          name: 'clothing',
          color: card.original.getFigureColor('clothing'),
        },
        {
          clothingTwoS: card.original.getFigureColor('clothingTwoS'),
          clothingTwo: card.original.getFigureColor('clothingTwo'),
          clothingSS: card.original.getFigureColor('clothingSS'),
          clothingS: card.original.getFigureColor('clothingS'),
          clothingL: card.original.getFigureColor('clothingL'),
        },
      ),

      axe: new Trait(
        {
          name: 'axe',
          color: card.original.getFigureColor('axe'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              h: -180 / 255,
              s: randomRange(0, 1),
              l: randomRange(1, 1.8),
            });
          },
        },
        {
          axeHandleTwo: card.original.getFigureColor('axeHandleTwo'),
          axeHandleS: card.original.getFigureColor('axeHandleS'),
          axeHandle: card.original.getFigureColor('axeHandle'),
          axeS: card.original.getFigureColor('axeS'),
          axeL: card.original.getFigureColor('axeL'),
        },
      ),
    },
  };
}

export function getMetadataOriginalJackHearts(card: Card): MetadataJackHearts {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsJackHearts,
    traits: {
      background: new Trait({
        name: 'background',
        color: card.original.getFigureColor('background'),
      }),

      suit: new Trait(
        {
          name: 'cardSuit',
          color: card.original.getFigureColor('cardSuit'),
        },
        {
          cardSuitL: card.original.getFigureColor('cardSuitL'),
          cardSuitS: card.original.getFigureColor('cardSuitS'),
        },
      ),

      hair: new Trait(
        {
          name: 'hair',
          color: card.original.getFigureColor('hair'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 0, max: 40 / 255 },
              s: randomRange(0, 2),
              l: randomRange(0.7, 1.7),
            });
          },
        },
        {
          hairS: card.original.getFigureColor('hairS'),
        },
      ),

      clothing: new Trait(
        {
          name: 'clothing',
          color: card.original.getFigureColor('clothing'),
        },
        {
          clothingHeadS: card.original.getFigureColor('clothingHeadS', false),
          clothingHead: card.original.getFigureColor('clothingHead'),
          clothingL: card.original.getFigureColor('clothingL'),
          clothingS: card.original.getFigureColor('clothingS'),
          clothingAdditionalS: card.original.getFigureColor(
            'clothingAdditionalS',
          ),
          clothingAdditional:
            card.original.getFigureColor('clothingAdditional'),
        },
      ),

      spear: new Trait(
        {
          name: 'spear',
          color: card.original.getFigureColor('spear'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 20 / 255, max: 40 / 255 },
              s: randomRange(0, 1),
              l: randomRange(1, 1.7),
            });
          },
        },
        {
          spearS: card.original.getFigureColor('spearS'),
          spearHandleS: card.original.getFigureColor('spearHandleS'),
          spearHandle: card.original.getFigureColor('spearHandle'),
        },
      ),
    },
  };
}

export function getMetadataOriginalJackSpades(card: Card): MetadataJackSpades {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsJackSpades,
    traits: {
      background: new Trait({
        name: 'background',
        color: card.original.getFigureColor('background'),
      }),

      suit: new Trait(
        {
          name: 'cardSuit',
          color: card.original.getFigureColor('cardSuit'),
        },
        {
          cardSuitL: card.original.getFigureColor('cardSuitL'),
        },
      ),

      hair: new Trait(
        {
          name: 'hair',
          color: card.original.getFigureColor('hair'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 0, max: 40 / 255 },
              s: randomRange(0, 2),
              l: randomRange(0.7, 1.7),
            });
          },
        },
        {
          hairS: card.original.getFigureColor('hairS'),
        },
      ),

      clothing: new Trait(
        {
          name: 'clothing',
          color: card.original.getFigureColor('clothing'),
        },
        {
          clothingS: card.original.getFigureColor('clothingS'),
          clothingL: card.original.getFigureColor('clothingL'),
        },
      ),

      dagger: new Trait(
        {
          name: 'daggerColor',
          color: card.original.getFigureColor('daggerColor'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 20 / 255, max: 40 / 255 },
              s: randomRange(0, 1),
              l: randomRange(1, 1.7),
            });
          },
        },
        {
          daggerColorSS: card.original.getFigureColor('daggerColorSS'),
          daggerColorS: card.original.getFigureColor('daggerColorS'),
          daggerColorL: card.original.getFigureColor('daggerColorL'),
        },
      ),
    },
  };
}

export function getMetadataOriginalJack(card: Card, suit?: Suits) {
  return {
    [Suits.Clubs]: getMetadataOriginalJackClubs,
    [Suits.Diamonds]: getMetadataOriginalJackDiamonds,
    [Suits.Hearts]: getMetadataOriginalJackHearts,
    [Suits.Spades]: getMetadataOriginalJackSpades,
  }[suit || card.suit](card);
}

// @Schema()
// export class CardJack extends Card {
//   constructor(name: CardsNames, suit?: Suits) {
//     super(name);
//     if (suit) {
//       this.suit = suit;
//     }
//     this.metadata = getMetadataOriginalJack(this);
//   }
// }

// export type CardJackDocument = CardJack & Document;
// export const SchemaCardJack = SchemaFactory.createForClass(CardJack);
