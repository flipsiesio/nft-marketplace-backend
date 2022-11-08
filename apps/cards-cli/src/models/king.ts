import { randomRange } from '../functions.util';
import { Card, Metadata, Suits } from './card';
import { Trait } from './card-trait';

// export const ColorsKingHearts = {
//   hair: [
//     ['DE341A', 'C51D1D'],
//     ['F4BF70', 'DEA44D'],
//   ],
//   clothing: [
//     ['DE341A', 'C51D1D'],
//     ['7D51B7', '5F3796'],
//     ['90B751', '709631'],
//     ['3092ED', '1771C4'],
//     ['EADC5D', 'CFB040'],
//   ],
// };

// export const ColorsKingDiamonds = {
//   hair: [
//     ['DF2208', 'B31A18'],
//     ['F4BF70', 'DEA44D'],
//   ],
//   clothing: [
//     ['1D9848', '127133', '105A2A'],
//     ['7D51B7', '5F3796', '492679'],
//     ['90B751', '709631', '5E8224'],
//     ['3092ED', '1771C4', '0B5EAB'],
//     ['EADC5D', 'CFB040', 'BD9C27'],
//   ],
// };

// export const ColorsKingSpades = {
//   hair: [
//     ['282724', '151515'],
//     ['49250F', '311809'],
//   ],
//   clothing: [
//     ['DF2208', 'B31A18', '9D0E0C'],
//     ['7D51B7', '5F3796', '492679'],
//     ['90B751', '709631', '5E8224'],
//     ['3B3DBB', '292B99', '16186E'],
//     ['EADC5D', 'CFB040', 'BD9C27'],
//     ['6F7188', '515369', '3B3D4D'],
//   ],
// };

// export const ColorsKingClubs = {
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

export interface MetadataKingClubs extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    gold: Trait;
    hair: Trait;
    clothing: Trait;

    decoration: Trait;
  };
}

export interface MetadataKingDiamonds extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    gold: Trait;
    hair: Trait;
    clothing: Trait;
  };
}

export interface MetadataKingHearts extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    gold: Trait;
    hair: Trait;
    clothing: Trait;

    //Особая черта
    egg: Trait;
    decoration: Trait;
  };
}

export interface MetadataKingSpades extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    gold: Trait;
    hair: Trait;
    clothing: Trait;

    //Особая черта
    decoration: Trait;
    silver: Trait;
  };
}

export function getMetadataOriginalKingClubs(card: Card): MetadataKingClubs {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsKingClubs,
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

      gold: new Trait(
        {
          name: 'gold',
          color: card.original.getFigureColor('gold'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 20 / 255, max: 40 / 255 },
              s: randomRange(0, 2),
              l: randomRange(1, 2),
            });
          },
        },
        {
          silverL: card.original.getFigureColor('silverL'),
          silverS: card.original.getFigureColor('silverS'),
          goldSS: card.original.getFigureColor('goldSS'),
          goldS: card.original.getFigureColor('goldS'),
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
        },
      ),

      //Особая черта
      decoration: new Trait(
        {
          name: 'decoration',
          color: card.original.getFigureColor('decoration'),
        },
        {
          decorationS: card.original.getFigureColor('decorationS'),
        },
      ),
    },
  };
}

export function getMetadataOriginalKingDiamonds(
  card: Card,
): MetadataKingDiamonds {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsKingDiamonds,
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

      gold: new Trait(
        {
          name: 'gold',
          color: card.original.getFigureColor('gold'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 20 / 255, max: 40 / 255 },
              s: randomRange(0, 2),
              l: randomRange(1, 2),
            });
          },
        },
        {
          goldSS: card.original.getFigureColor('goldSS'),
          goldS: card.original.getFigureColor('goldS'),
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
          hearSS: card.original.getFigureColor('hearSS'),
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
          clothingL: card.original.getFigureColor('clothingL'),
        },
      ),
    },
  };
}

export function getMetadataOriginalKingHearts(card: Card): MetadataKingHearts {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsKingHearts,
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

      gold: new Trait(
        {
          name: 'gold',
          color: card.original.getFigureColor('gold'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 20 / 255, max: 40 / 255 },
              s: randomRange(0, 2),
              l: randomRange(1, 2),
            });
          },
        },
        {
          goldL: card.original.getFigureColor('goldL'),
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
          hearS: card.original.getFigureColor('hearS'),
        },
      ),

      clothing: new Trait(
        {
          name: 'clothing',
          color: card.original.getFigureColor('clothing'),
        },
        {
          clothingL: card.original.getFigureColor('clothingL'),
          clothingS: card.original.getFigureColor('clothingS'),
        },
      ),

      //Особая черта
      egg: new Trait(
        {
          name: 'egg',
          color: card.original.getFigureColor('egg'),
          generator: (trait: Trait, index = 0) => {
            if (index < 471) {
              //Math.random() > 0.5) {
              trait.setSaturation(0);
              trait.displaceHSL({ h: 0, s: 1, l: 25 });
            } else {
              trait.displaceHSL({
                dh: { min: 0, max: 1 },
                s: randomRange(0.5, 1),
                l: 1,
              });
            }
          },
        },
        {
          eggS: card.original.getFigureColor('eggS'),
        },
      ),

      decoration: new Trait({
        name: 'decoration',
        color: card.original.getFigureColor('decoration'),
      }),
    },
  };
}

export function getMetadataOriginalKingSpades(card: Card): MetadataKingSpades {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsKingSpades,
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
          cardSuitLL: card.original.getFigureColor('cardSuitLL'),
        },
      ),

      gold: new Trait(
        {
          name: 'gold',
          color: card.original.getFigureColor('gold'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              dh: { min: 20 / 255, max: 40 / 255 },
              s: randomRange(0, 2),
              l: randomRange(1, 2),
            });
          },
        },
        {
          goldSS: card.original.getFigureColor('goldSS'),
          goldS: card.original.getFigureColor('goldS'),
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
          clothingSS: card.original.getFigureColor('clothingSS'),
          clothingS: card.original.getFigureColor('clothingS'),
        },
      ),

      //Особая черта
      decoration: new Trait(
        {
          name: 'decoration1',
          color: card.original.getFigureColor('decoration1'),
        },
        {
          decoration2S: card.original.getFigureColor('decoration2S'),
          decoration2: card.original.getFigureColor('decoration2'),
          decoration1S: card.original.getFigureColor('decoration1S'),
        },
      ),

      silver: new Trait(
        {
          name: 'silver',
          color: card.original.getFigureColor('silver'),
          generator: (trait: Trait) => {
            trait.displaceHSL({
              h: randomRange(-0.05, 0.05),
              s: randomRange(0, 2),
              l: randomRange(0.8, 1.5),
            });
          },
        },
        {
          silverS: card.original.getFigureColor('silverS'),
        },
      ),
    },
  };
}

export function getMetadataOriginalKing(card: Card, suit?: Suits) {
  return {
    [Suits.Clubs]: getMetadataOriginalKingClubs,
    [Suits.Diamonds]: getMetadataOriginalKingDiamonds,
    [Suits.Hearts]: getMetadataOriginalKingHearts,
    [Suits.Spades]: getMetadataOriginalKingSpades,
  }[suit || card.suit](card);
}

// @Schema()
// export class CardKing extends Card {
//   @Prop({ type: Object })
//   metadata: MetadataCardKing = getMetadataCardKing.call(this);
// }

// export type CardKingDocument = CardKing & Document;
// export const SchemaCardKing = SchemaFactory.createForClass(CardKing);
