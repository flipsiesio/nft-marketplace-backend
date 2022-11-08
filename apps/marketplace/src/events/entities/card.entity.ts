import { Faces, Suits } from 'apps/cards-cli/src/models/card';
import { Trait } from 'apps/cards-cli/src/models/card-trait';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export const CardGroup = new (class CardGroup {
  private static readonly groups = {
    jack: {
      bit: 1 << 0,
      check: (card: CardEntity) => card.name.startsWith('jack-'),
    },
    king: {
      bit: 1 << 1,
      check: (card: CardEntity) => card.name.startsWith('king-'),
    },
    queen: {
      bit: 1 << 2,
      check: (card: CardEntity) => card.name.startsWith('queen-'),
    },
    joker: {
      bit: 1 << 3,
      check: (card: CardEntity) => card.name.startsWith('joker-'),
    },
    rare: {
      bit: 1 << 4,
      check: (card: CardEntity) => card.name.startsWith('unique-'),
    },
  };

  public groupCheck(card: CardEntity) {
    let groupBits = 0;
    let groupName: keyof typeof CardGroup.groups;
    for (groupName in CardGroup.groups) {
      const { bit, check } = CardGroup.groups[groupName];
      if (check(card)) {
        groupBits |= bit;
      }
    }
    return groupBits;
  }

  public groupBit(...names: (keyof typeof CardGroup.groups | string)[]) {
    return names.reduce(
      (bits, name) => bits | (CardGroup.groups[name]?.bit ?? 0),
      0,
    );
  }
})();

@Entity()
export class CardEntity {
  @PrimaryColumn()
  cardId: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Faces })
  face: Faces;

  @Column({ type: 'enum', enum: Suits })
  suit: Suits;

  @Column()
  tears: boolean;

  @Column({ unique: true })
  url: string;

  @Column({ type: 'jsonb' })
  traits: Record<string, Trait>;

  @Column({ type: 'float8' })
  faceFrequency: number;

  @Column({ type: 'float8' })
  suitFrequency: number;

  @Column({ type: 'float8' })
  maxRarity: number;

  @Column({ type: 'float8' })
  mediumRarity: number;

  @Column({ type: 'float8' })
  frequencyRarity: number;

  @Column({ unique: true })
  hash: string;

  @Column({ default: false })
  minted: boolean;

  @Column({ type: 'int' })
  group: number;
  
  @Column({
      nullable: true,
      transformer: {
          to(value){
              return value ? value.toLowerCase() : value;
          },
          from(value) {
              return value;
          }
      }
  })
  ownerAddress?: string;
}
