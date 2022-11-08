import { randomRange } from '../functions.util';
import { Card, Metadata, Suits } from './card';
import { Trait } from './card-trait';

// export const ColorsQueenHearts = {
//   hair: [
//     ['B41A18', '7E1311'],
//     ['F4BF70', 'DEA44D'],
//   ],
//   clothing: [
//     ['E82626', 'B41A18', '7E1311'],
//     ['7D51B7', '5F3796', '49257B'],
//     ['90B751', '709631', '597A23'],
//     ['8AA0E8', '40569E', '2F4075'],
//     ['EADC5D', 'CFB040', 'B5972C'],
//   ],
// };

// export const ColorsQueenDiamonds = {
//   hair: [
//     ['FB710F', 'B75713'],
//     ['F4BF70', 'DEA44D'],
//   ],
//   clothing: [
//     ['E82626', 'B41A18'],
//     ['7D51B7', '5F3796'],
//     ['90B751', '709631'],
//     ['8ED5EE', '71B6CF'],
//     ['EADC5D', 'CFB040'],
//   ],
// };

// export const ColorsQueenClubs = {
//   hair: [
//     ['282724', '151515'],
//     ['49250F', '311809'],
//   ],
//   clothing: [
//     ['E82626', 'B41A18', '9D0E0C'],
//     ['7D51B7', '5F3796', '492679'],
//     ['90B751', '709631', '5E8224'],
//     ['8ED5EE', '71B6CF', '173B4B'],
//     ['EADC5D', 'CFB040', 'BD9C27'],
//     ['6F7188', '515369', '3B3D4D'],
//   ],
// };

// export const ColorsQueenSpades = {
//   hair: [
//     ['282724', '151515'],
//     ['49250F', '311809'],
//   ],
//   clothing: [
//     ['E82626', 'B41A18', '9D0E0C'],
//     ['7D51B7', '5F3796', '492679'],
//     ['90B751', '709631', '5E8224'],
//     ['3092ED', '1771C4', '0B5EAB'],
//     ['EADC5D', 'CFB040', 'BD9C27'],
//     ['6F7188', '515369', '3B3D4D'],
//   ],
// };

export interface MetadataQueenClubs extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    gold: Trait;
    hair: Trait;
    clothing: Trait;

    //Особая черта
    manicure: Trait;
  };
}

export interface MetadataQueenDiamonds extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    gold: Trait;
    hair: Trait;
    clothing: Trait;

    //Особая черта
    decoration: Trait;
  };
}

export interface MetadataQueenHearts extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    gold: Trait;
    hair: Trait;
    clothing: Trait;
  };
}

export interface MetadataQueenSpades extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    hair: Trait;
    clothing: Trait;

    //Особая черта
    manicure: Trait;
    silver: Trait;
  };
}

export function getMetadataOriginalQueenClubs(card: Card): MetadataQueenClubs {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsQueenClubs,
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
          clothingSSS: card.original.getFigureColor('clothingSSS'),
          clothingSS: card.original.getFigureColor('clothingSS'),
          clothingS: card.original.getFigureColor('clothingS'),
          clothingL: card.original.getFigureColor('clothingL'),
        },
      ),

      //Особая черта
      manicure: new Trait(
        {
          name: 'manicure',
          color: card.original.getFigureColor('manicure'),
        },
        {
          manicureL: card.original.getFigureColor('manicureL', false),
          manicureS: card.original.getFigureColor('manicureS', false),
        },
      ),
    },
  };
}

export function getMetadataOriginalQueenDiamonds(
  card: Card,
): MetadataQueenDiamonds {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsQueenDiamonds,
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
          cardSuitS: card.original.getFigureColor('cardSuitS'),
          cardSuitAdditional:
            card.original.getFigureColor('cardSuitAdditional'),
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
          goldS: card.original.getFigureColor('goldS'),
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
          hairS: card.original.getFigureColor('hairS'),
          hairSS: card.original.getFigureColor('hairSS'),
        },
      ),

      clothing: new Trait(
        {
          name: 'clothing',
          color: card.original.getFigureColor('clothing'),
        },
        {
          clothingS: card.original.getFigureColor('clothingS'),
          clothingLL: card.original.getFigureColor('clothingLL'),
          clothingL: card.original.getFigureColor('clothingL'),
        },
      ),

      //Особая черта
      decoration: new Trait({
        name: 'decoration',
        color: card.original.getFigureColor('decoration'),
        generator: (trait: Trait) => {
          trait.displaceHSL({
            dh: { min: 0, max: 20 / 255 },
            s: randomRange(0.5, 2),
            l: randomRange(0.9, 1.4),
          });
        },
      }),
    },
  };
}

export function getMetadataOriginalQueenHearts(
  card: Card,
): MetadataQueenHearts {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsQueenHearts,
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
          cardSuitS: card.original.getFigureColor('cardSuitS'),
          cardSuitAdditional:
            card.original.getFigureColor('cardSuitAdditional'),
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
          goldS: card.original.getFigureColor('goldS'),
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
          hairS: card.original.getFigureColor('hairS'),
          hairL: card.original.getFigureColor('hairL'),
        },
      ),

      clothing: new Trait(
        {
          name: 'clothing',
          color: card.original.getFigureColor('clothing'),
        },
        {
          clothingS: card.original.getFigureColor('clothingS'),
          clothingAdditionalS: card.original.getFigureColor(
            'clothingAdditionalS',
          ),
          clothingAdditional:
            card.original.getFigureColor('clothingAdditional'),
        },
      ),
    },
  };
}

export function getMetadataOriginalQueenSpades(
  card: Card,
): MetadataQueenSpades {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsQueenSpades,
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
          hairSS: card.original.getFigureColor('hairSS'),
        },
      ),

      clothing: new Trait(
        {
          name: 'clothing',
          color: card.original.getFigureColor('clothing'),
        },
        {
          clothingSS: card.original.getFigureColor('clothingSS', false),
          clothingL: card.original.getFigureColor('clothingL'),
          clothingS: card.original.getFigureColor('clothingS'),
        },
      ),

      manicure: new Trait({
        name: 'manicure',
        color: card.original.getFigureColor('manicure'),
        generator: (trait: Trait) => {
          trait.displaceHSL({
            dh: { min: 0, max: 20 / 255 },
            s: randomRange(0.5, 2),
            l: randomRange(0.9, 1.4),
          });
        },
      }),

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
          silverSS: card.original.getFigureColor('silverSS'),
        },
      ),
    },
  };
}

export function getMetadataOriginalQueen(card: Card, suit?: Suits) {
  return {
    [Suits.Clubs]: getMetadataOriginalQueenClubs,
    [Suits.Diamonds]: getMetadataOriginalQueenDiamonds,
    [Suits.Hearts]: getMetadataOriginalQueenHearts,
    [Suits.Spades]: getMetadataOriginalQueenSpades,
  }[suit || card.suit](card);
}

// @Schema()
// export class CardQueen extends Card {
//   @Prop({ type: Object })
//   metadata: MetadataCardQueen = getMetadataCardQueen.call(this);
// }

// export type CardQueenDocument = CardQueen & Document;
// export const SchemaCardQueen = SchemaFactory.createForClass(CardQueen);
