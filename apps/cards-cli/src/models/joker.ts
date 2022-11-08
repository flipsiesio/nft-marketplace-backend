import { Card, Metadata, Suits } from './card';
import { Trait } from './card-trait';

// export const ColorsJoker = {
//   cloting: [
//     ['E82626', 'B41A18', '7E1311'],
//     ['7D51B7', '5F3796', '49257B'],
//     ['90B751', '709631', '597A23'],
//     ['3092ED', '1771C4', '0B5EAB'],
//     ['EADC5D', 'CFB040', 'B5972C'],
//   ],
// };

export interface MetadataJoker extends Metadata {
  traits: {
    background: Trait;
    suit: Trait;

    hair: Trait;
    clothing: Trait;

    //Особая черта
    backgroundDecor: Trait;
  };
}

export function getMetadataOriginalJoker(
  card: Card,
  suit?: Suits,
): MetadataJoker {
  return {
    faceFrequency: 0,
    suitFrequency: 0,
    tears: false,

    //traitsGenerator: ColorsJoker,
    traits: {
      background: new Trait({
        name: 'background',
        color: card.original.getFigureColor('background'),
      }),

      suit: new Trait({
        name: 'cardSuit',
        color: card.original.getFigureColor('cardSuit'),
      }),

      hair: new Trait(
        {
          name: 'hair',
          color: card.original.getFigureColor('hair'),
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
          clothingSS: card.original.getFigureColor('clothingSS'),
        },
      ),

      //Особая черта
      backgroundDecor: new Trait({
        name: 'background-decor',
        color: card.original.getFigureColor('background-decor'),
      }),
    },
  };
}

// @Schema()
// export class CardJoker extends Card {
//   @Prop({ type: Object })
//   metadata: MetadataJoker = getMetadataCardJoker.call(this);
// }

// export type CardJokerDocument = CardJoker & Document;
// export const SchemaCardJoker = SchemaFactory.createForClass(CardJoker);
