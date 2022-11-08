import { Injectable, Logger } from '@nestjs/common';
import { Card, CardDocument, CardsNames } from './models/card';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CardsTraits } from './cards-traits';
import { IpfsService } from '@app/common/ipfs';

function arrayShuffle(array: any[], offset = 0, range = array.length) {
  for (let i = offset; i < range; i++) {
    const b = array[i];
    const r = offset + Math.floor(Math.random() * (range - offset));
    array[i] = array[r];
    array[r] = b;
  }
}

function frequencyTraits(cards: Array<Card>, traitName: string, dist = 2) {
  cards = cards.filter((card, i) => {
    return card.metadata.traits[traitName] != undefined;
  });

  const distO = ((dist - 1) | 1) + 1;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let frequencySum = 0;
  for (let i = 0; i < cards.length; i++) {
    const color = cards[i].metadata.traits[traitName].main.color.getRGB();

    let distance = 1;
    for (let j = 0; j < cards.length; j++) {
      if (i == j) {
        continue;
      }
      const colorD = cards[j].metadata.traits[traitName].main.color.getRGB();
      distance += Math.pow(
        Math.pow(color.r - colorD.r, distO) +
          Math.pow(color.g - colorD.g, distO) +
          Math.pow(color.b - colorD.b, distO),
        1 / 2,
      );
    }

    const frequency = 1 / distance;

    cards[i].metadata.traits[traitName].frequency = frequency;
    max = Math.max(max, frequency);
    min = Math.min(min, frequency);
    frequencySum += frequency;
  }

  for (let i = 0; i < cards.length; i++) {
    const trait = cards[i].metadata.traits[traitName];
    if (max - min == 0) {
      trait.rarity = 1;
    } else {
      trait.rarity = 1 - (trait.frequency - min) / (max - min);
    }
    trait.frequency *= 100 / frequencySum;
    console.log(`№${i}`, trait.main.color.name, trait.frequency, trait.rarity);
  }

  return cards;
}

@Injectable()
export class CardsGenerate {
  logger = new Logger('CardsGenerate');
  cards = {
    [CardsNames.jackOfClubs]: [],
    [CardsNames.jackOfDiamonds]: [],
    [CardsNames.jackOfHearts]: [],
    [CardsNames.jackOfSpades]: [],

    [CardsNames.queenOfClubs]: [],
    [CardsNames.queenOfDiamonds]: [],
    [CardsNames.queenOfHearts]: [],
    [CardsNames.queenOfSpades]: [],

    [CardsNames.kingOfClubs]: [],
    [CardsNames.kingOfDiamonds]: [],
    [CardsNames.kingOfHearts]: [],
    [CardsNames.kingOfSpades]: [],

    [CardsNames.jokerBlack]: [],
    [CardsNames.jokerRed]: [],

    [CardsNames.uJackOfDiamonds]: [],
    [CardsNames.uJackOfHearts]: [],
    [CardsNames.uJackOfSpades]: [],
    [CardsNames.uKingOfDiamonds]: [],
    [CardsNames.uKingOfHearts]: [],
    [CardsNames.uQueenOfClubs]: [],
    [CardsNames.uQueenOfSpades]: [],

    all: [],
  };

  constructor(
    private readonly cardsTraits: CardsTraits,
    @InjectModel(Card.name) private cardRepository: Model<CardDocument>,
    private readonly ipfs: IpfsService,
  ) {
    this.cardsTraits.loadOriginalCards();

    //this.generate();

    //console.log('GENERATED!');

    // [CardsNames.uJackOfDiamonds,
    // CardsNames.uJackOfHearts,
    // CardsNames.uJackOfSpades,
    // CardsNames.uKingOfDiamonds,
    // CardsNames.uKingOfHearts,
    // CardsNames.uQueenOfClubs,
    // CardsNames.uQueenOfSpades].forEach((cardName) => {
    //   const card = new Card(cardName);
    //   //console.log(card.original.metadata.traits.hair);
    //   //card.original.metadataRandomTraits({ tears: Math.random() > 0.5, data: Math.random() * 771 });
    //   //card.original.saveContent();
    //   card.getMetadata();
    //   //console.log(card.original.metadata.traits.background);
    //   //this.cardRepository.create(card);
    //   card.original.contentReset();
    //   card.original.metadataReset();

    //   cards[cardName].push(card);
    //   cards.all.push(card);
    // });

    //frequencyTraits(cards.all, 'background');

    // const card = new Card(CardsNames.jackOfClubs);
    // card.original.metadataRandomTraits();
    // card.original.saveContent();
    // card.getMetadata();
    // card.original.contentReset();
    // card.original.metadataReset();

    //console.log(cards);
    //frequencyTraits(cards.all, 'egg');
    // for (const cardName in cards) {
    //   frequencyTraits(cards[cardName], 'background');
    // }

    // for (let i = 0; i < 6500; i++) {
    //   const cardName = [
    //     CardsNames.jackOfClubs,
    //     CardsNames.jackOfDiamonds,
    //     CardsNames.jackOfHearts,
    //     CardsNames.jackOfSpades,
    //     CardsNames.queenOfClubs,
    //     CardsNames.queenOfDiamonds,
    //     CardsNames.queenOfHearts,
    //     CardsNames.queenOfSpades,
    //     CardsNames.kingOfClubs,
    //     CardsNames.kingOfDiamonds,
    //     CardsNames.kingOfSpades,
    //   ][Math.floor(Math.random() * 11)];
    //   const card = new Card(cardName);
    //   card.original.metadataRandomTraits();
    //   //card.original.saveContent();
    //   card.getMetadata();
    //   this.cardRepository.create(card);
    //   card.original.contentReset();
    //   card.original.metadataReset();
    // }

    // // Egg 771
    // for (let i = 0; i < 771; i++) {
    //   const card = new Card(CardsNames.kingOfHearts);
    //   card.original.metadataRandomTraits();
    //   //card.original.saveContent(`${card.name}-${i}`);
    //   card.getMetadata();
    //   this.cardRepository.create(card);
    //   card.original.contentReset();
    //   card.original.metadataReset();
    // }

    // // Jokers 25
    // for (let i = 0; i < 12; i++) {
    //   const card = new Card(CardsNames.jokerBlack);
    //   card.original.metadataRandomTraits();
    //   //card.original.saveContent(`${card.name}-${i}`);
    //   card.getMetadata();
    //   this.cardRepository.create(card);
    //   card.original.contentReset();
    //   card.original.metadataReset();
    // }
    // for (let i = 0; i < 13; i++) {
    //   const card = new Card(CardsNames.jokerRed);
    //   card.original.metadataRandomTraits();
    //   //card.original.saveContent(`${card.name}-${i}`);
    //   card.getMetadata();
    //   this.cardRepository.create(card);
    //   card.original.contentReset();
    //   card.original.metadataReset();
    // }

    // Rare 7

    // console.log(card.getDescription());
    // // console.log(card.metadata);
    // // console.log('BEFORE: ', card.metadata.traitClothes);
    //const metadata: MetadataJackClubs = card.original.metadata;
    // card.original.metadata.traits.background.displaceHSL({ h: Math.random(), s: Math.random(), l: randomRange(0.3, 1) });
    // card.original.metadata.traits.hair.displaceHSL({ h: Math.random(), s: Math.random(), l: randomRange(0.3, 1) });
    // const s = card.original;//.traits.traitClothes.main.color.getHSL().s;
    // console.log(s);
    // card.original.metadata.traits.clothing.displaceHSL({ h: Math.random(), s: 0 /*Math.random()*/, l: 1 /*randomRange(0.3, 1)*/ });
    // card.original.metadata.traits.gold.displaceHSL({ h: Math.random(), s: Math.random(), l: randomRange(0.3, 1) });
    // // console.log('AFTER: ', card.metadata.traitClothes);
    // console.log(card.getDescription());

    //this.cardRepository.create(card);
  }

  checkUnique(cardCheck: Card) {
    return (
      this.cards.all.find((card, i) => {
        return card.hash == cardCheck.hash;
      }) == undefined
    );
  }

  // async generateTest(save: boolean = false) {
  //   for (const cardName of
  //     [CardsNames.queenOfClubs]
  //   ) {
  //     if (await this.generateCard(cardName, save, null) == false) {
  //       console.log(`Error: ${cardName}`);
  //     } else {
  //       await this.cardRepository.create(this.cards.all[this.cards.all.length - 1]);
  //     }

  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // cardFromObject(cardObject: any): Card {
  //   const card = new Card(cardObject.name);
  //   card.face = cardObject.face;
  //   card.suit = cardObject.suit;
  //   card.description = cardObject.description;
  //   card.hash = cardObject.hash;
  //   card.metadata = {
  //     faceFrequency: cardObject.faceFrequency,
  //     suitFrequency: cardObject.suitFrequency,
  //     tears: cardObject.tears,
  //     frequencyRarity: cardObject.frequencyRarity,
  //     rarity: cardObject.rarity,
  //     maxRarity: cardObject.maxRarity,
  //     mediumRarity: cardObject.mediumRarity,
  //     url: cardObject.url,
  //     traits: {},
  //   };

  //   const objectTraits = cardObject.metadata.traits;
  //   for (const nameObjectTrait in objectTraits) {
  //     const objectTrait = objectTraits[nameObjectTrait];

  //     new Trait()
  //   }

  //   return card;
  // }

  async generateCard(
    cardName: CardsNames,
    save = { saveContent: false, path: '', saveIpfs: true },
    options?: { tears?: boolean; data?: unknown },
  ) {
    const card = new Card(cardName);
    card.cardId = this.cards.all.length;

    if (options !== null) {
      card.original.metadataRandomTraits(options);
    }

    card.getMetadata();
    if (options?.tears) {
      card.metadata.tears = options.tears;
    }

    if (!this.checkUnique(card)) {
      this.logger.log(`Error ${cardName}`);
      card.original.contentReset();
      card.original.metadataReset();
      return false;
    } else {
      card.metadata.content = card.getContent(true);
    }

    if (save.saveContent) {
      const name = `${save.path ? save.path + '/' : ''}` + card.name;
      console.log(name);
      card.original.saveContent(name);
    }

    card.original.contentReset();
    card.original.metadataReset();

    if (save.saveIpfs) {
      const content = card.getContent(true);

      const added = await this.ipfs.addFile(content);
      const url = added.path;
      card.metadata.url = `'${cardName}': https://flipsies.infura-ipfs.io/ipfs/${url}`;
      this.logger.log(card.metadata.url);
    }

    this.cards[cardName].push(card);
    this.cards.all.push(card);

    return true;
  }

  async generate(
    saveContent = false,
    calcUnique = true,
    saveDB = true,
    saveIpfs = true,
  ) {
    for (let i = 0; i < 6500; i++) {
      const cardName = [
        CardsNames.jackOfClubs,
        CardsNames.jackOfDiamonds,
        CardsNames.jackOfHearts,
        CardsNames.jackOfSpades,
        CardsNames.queenOfClubs,
        CardsNames.queenOfDiamonds,
        CardsNames.queenOfHearts,
        CardsNames.queenOfSpades,
        CardsNames.kingOfClubs,
        CardsNames.kingOfDiamonds,
        CardsNames.kingOfSpades,
      ][Math.floor(Math.random() * 11)];

      if (
        (await this.generateCard(cardName, {
          saveContent,
          saveIpfs,
          path: 'colorized',
        })) == false
      ) {
        i -= 1;
      }
      if (i % 100 == 0) {
        this.logger.log('GENERATED: ', i);
      }
    }

    this.logger.log('GENERATED RANDOM CARDS');

    // Коровевские Яйца 00
    for (let i = 0; i < 771; i++) {
      const cardName = CardsNames.kingOfHearts;

      if (
        (await this.generateCard(
          cardName,
          { saveContent, saveIpfs, path: 'egg' },
          { tears: false, data: i },
        )) == false
      ) {
        i -= 1;
      }
    }

    this.logger.log('GENERATED KING HEARTS CARDS');

    for (let i = 0; i < 500; i++) {
      const cardName = [
        CardsNames.jackOfClubs,
        CardsNames.jackOfDiamonds,
        CardsNames.jackOfHearts,
        CardsNames.jackOfSpades,
        CardsNames.queenOfClubs,
        CardsNames.queenOfDiamonds,
        CardsNames.queenOfHearts,
        CardsNames.queenOfSpades,
        CardsNames.kingOfClubs,
        CardsNames.kingOfDiamonds,
        CardsNames.kingOfSpades,
      ][Math.floor(Math.random() * 11)];

      if (
        (await this.generateCard(
          cardName,
          { saveContent, saveIpfs, path: 'tears' },
          { tears: true },
        )) == false
      ) {
        i -= 1;
      }
    }

    this.logger.log('GENERATED TEARS CARDS');

    for (let i = 0; i < 25; i++) {
      const cardName = [CardsNames.jokerBlack, CardsNames.jokerRed][
        Math.floor(Math.random() * 2)
      ];

      if (
        (await this.generateCard(cardName, {
          saveContent,
          saveIpfs,
          path: 'jokers',
        })) == false
      ) {
        i -= 1;
      }
    }

    this.logger.log('GENERATED JOKER CARDS');

    for (const cardName of [
      CardsNames.uJackOfDiamonds,
      CardsNames.uJackOfHearts,
      CardsNames.uJackOfSpades,
      CardsNames.uKingOfDiamonds,
      CardsNames.uKingOfHearts,
      CardsNames.uQueenOfClubs,
      CardsNames.uQueenOfSpades,
    ]) {
      if (
        (await this.generateCard(
          cardName,
          { saveContent, saveIpfs, path: 'unique' },
          null,
        )) == false
      ) {
        this.logger.log(`Error: ${cardName}`);
      }
    }

    this.logger.log('GENERATED UNIQUE CARDS');

    arrayShuffle(this.cards.all, 0, 6500);
    arrayShuffle(this.cards.all, 6500, 7271);
    arrayShuffle(this.cards.all, 7271, 7771);
    arrayShuffle(this.cards.all, 7771, 7796);
    arrayShuffle(this.cards.all, 7796, 7803);

    for (let i = 0; i < this.cards.all.length; i++) {
      this.cards.all[i].cardId = i;
    }

    if (calcUnique) {
      frequencyTraits(this.cards.all, 'background');
      frequencyTraits(this.cards.all, 'hair');
      frequencyTraits(this.cards.all, 'clothing');
      frequencyTraits(this.cards.all, 'suit');

      //jack
      frequencyTraits(this.cards['jack-of-clubs'], 'gold');
      frequencyTraits(this.cards['jack-of-diamonds'], 'axe');
      frequencyTraits(this.cards['jack-of-hearts'], 'spear');
      frequencyTraits(this.cards['jack-of-spades'], 'dagger');

      //queen
      frequencyTraits(this.cards['queen-of-clubs'], 'gold');
      frequencyTraits(this.cards['queen-of-clubs'], 'manicure');

      frequencyTraits(this.cards['queen-of-diamonds'], 'gold');
      frequencyTraits(this.cards['queen-of-diamonds'], 'axe');
      frequencyTraits(this.cards['queen-of-diamonds'], 'decoration');

      frequencyTraits(this.cards['queen-of-hearts'], 'gold');

      frequencyTraits(this.cards['queen-of-spades'], 'manicure');
      frequencyTraits(this.cards['queen-of-spades'], 'silver');

      //king
      frequencyTraits(this.cards['king-of-clubs'], 'gold');
      frequencyTraits(this.cards['king-of-clubs'], 'decoration');

      frequencyTraits(this.cards['king-of-diamonds'], 'gold');

      frequencyTraits(this.cards['king-of-hearts'], 'gold');
      frequencyTraits(this.cards['king-of-hearts'], 'egg');
      frequencyTraits(this.cards['king-of-hearts'], 'decoration');

      frequencyTraits(this.cards['king-of-spades'], 'gold');
      frequencyTraits(this.cards['king-of-spades'], 'decoration');
      frequencyTraits(this.cards['king-of-spades'], 'silver');

      //joker
      frequencyTraits(this.cards['joker-black'], 'backgroundDecor');
      frequencyTraits(this.cards['joker-red'], 'backgroundDecor');

      //unique
      frequencyTraits(this.cards['unique-jack-of-diamonds'], 'axe');
      frequencyTraits(this.cards['unique-jack-of-hearts'], 'spear');
      frequencyTraits(this.cards['unique-jack-of-spades'], 'dagger');

      frequencyTraits(this.cards['unique-queen-of-clubs'], 'gold');
      frequencyTraits(this.cards['unique-queen-of-clubs'], 'manicure');

      frequencyTraits(this.cards['unique-queen-of-spades'], 'manicure');
      frequencyTraits(this.cards['unique-queen-of-spades'], 'silver');

      frequencyTraits(this.cards['unique-king-of-diamonds'], 'gold');

      frequencyTraits(this.cards['unique-king-of-hearts'], 'gold');
      frequencyTraits(this.cards['unique-king-of-hearts'], 'egg');
      frequencyTraits(this.cards['unique-king-of-hearts'], 'decoration');

      const faces = {
        Jack: 0,
        Queen: 0,
        King: 0,
        Joker: 0,
      };
      const suits = {
        Clubs: 0,
        Diamonds: 0,
        Hearts: 0,
        Spades: 0,
        Red: 0,
        Black: 0,
      };

      this.cards.all.forEach((card: Card) => {
        faces[card.face]++;
        suits[card.suit]++;
      });

      this.cards.all.forEach(async (card: Card) => {
        card.metadata.faceFrequency = faces[card.face] / this.cards.all.length;
        card.metadata.suitFrequency = suits[card.suit] / this.cards.all.length;

        let maxRarity = 0;
        let mediumRarity = 0;
        let frequencyRarity = 1;

        const traits = card.metadata.traits;
        for (const traitName in traits) {
          const trait = traits[traitName];
          //description += `Trait: ${trait.main.name}, Color: ${trait.main.color.name}, Frequency: ${trait.frequency * 100}%\n`;
          if (trait.rarity > maxRarity) {
            maxRarity = trait.rarity;
          }
          if (trait.rarity) {
            mediumRarity += trait.rarity;
          }

          frequencyRarity *= 1 - trait.frequency / 100;
        }
        card.metadata.maxRarity = maxRarity;
        card.metadata.mediumRarity = mediumRarity / Object.keys(traits).length;
        card.metadata.frequencyRarity = (1 - frequencyRarity) * 100;
      });
    }

    if (saveDB) {
      for (const card of this.cards.all) {
        await this.cardRepository.create(card);
      }
    }
    this.logger.log('GENERATED');

    // const card = new Card(cardName);
    // card.original.metadataRandomTraits({ tears: false, data: i });
    // card.getMetadata();
    // this.cardRepository.create(card);
    // card.original.contentReset();
    // card.original.metadataReset();

    // cards[cardName].push(card);
    // cards.all.push(card);

    // for (let i = 0; i < 100; i++) {
    //   const cardName = [
    //     CardsNames.jackOfClubs,
    //     CardsNames.jackOfDiamonds,
    //     CardsNames.jackOfHearts,
    //     CardsNames.jackOfSpades,
    //     CardsNames.queenOfClubs,
    //     CardsNames.queenOfDiamonds,
    //     CardsNames.queenOfHearts,
    //     CardsNames.queenOfSpades,
    //     CardsNames.kingOfClubs,
    //     CardsNames.kingOfDiamonds,
    //     CardsNames.kingOfHearts,
    //     CardsNames.kingOfSpades,
    //     CardsNames.jokerBlack,
    //     CardsNames.jokerRed,
    //   ][Math.floor(Math.random() * 14)];

    //   if (await this.generateCard(cardName, { tears: Math.random() > 0.5, data: Math.random() * 771 }) == false) {
    //     i -= 1;
    //   }
    //   // const card = new Card(cardName);
    //   // //console.log(card.original.metadata.traits.hair);
    //   // card.original.metadataRandomTraits({ tears: Math.random() > 0.5, data: Math.random() * 771 });
    //   // card.original.saveContent();
    //   // card.getMetadata();
    //   // //console.log(card.original.metadata.traits.hair);
    //   // //this.cardRepository.create(card);
    //   // card.original.contentReset();
    //   // card.original.metadataReset();

    //   // cards[cardName].push(card);
    //   // cards.all.push(card);
    // }
  }

  async generateFast(
    saveContent = false,
    calcUnique = true,
    saveDB = true,
    saveIpfs = true,
  ) {
    {
      const cards = [
        CardsNames.uJackOfDiamonds,
        CardsNames.uJackOfHearts,
        CardsNames.uJackOfSpades,
        CardsNames.uKingOfDiamonds,
        CardsNames.uKingOfHearts,
        CardsNames.uQueenOfClubs,
        CardsNames.uQueenOfSpades,
      ];
      for (let i = 0; i < cards.length; i++) {
        const cardName = cards[i];
        if (
          (await this.generateCard(
            cardName,
            { saveContent, saveIpfs, path: 'unique' },
            null,
          )) == false
        ) {
          this.logger.log(`Error: ${cardName}`);
          i -= 1;
        }
      }
    }

    this.logger.log('FAST GENERATED UNIQUE CARDS');

    for (let j = 0; j < 2; j++) {
      const cards = [
        CardsNames.jackOfClubs,
        CardsNames.jackOfDiamonds,
        CardsNames.jackOfHearts,
        CardsNames.jackOfSpades,
        CardsNames.queenOfClubs,
        CardsNames.queenOfDiamonds,
        CardsNames.queenOfHearts,
        CardsNames.queenOfSpades,
        CardsNames.kingOfClubs,
        CardsNames.kingOfDiamonds,
        CardsNames.kingOfSpades,
      ];
      for (let i = 0; i < cards.length; i++) {
        const cardName = cards[i];
        if (
          (await this.generateCard(cardName, {
            saveContent,
            saveIpfs,
            path: 'colorized',
          })) == false
        ) {
          i -= 1;
        }
      }
    }

    this.logger.log('FAST GENERATED RANDOM CARDS');

    // Коровевские Яйца 00
    for (let i = 0; i < 3; i++) {
      const cardName = CardsNames.kingOfHearts;

      if (
        (await this.generateCard(
          cardName,
          { saveContent, saveIpfs, path: 'egg' },
          { tears: false, data: i },
        )) == false
      ) {
        i -= 1;
      }
    }

    this.logger.log('FAST GENERATED KING HEARTS CARDS');

    for (let j = 0; j < 2; j++) {
      const cards = [
        CardsNames.jackOfClubs,
        CardsNames.jackOfDiamonds,
        CardsNames.jackOfHearts,
        CardsNames.jackOfSpades,
        CardsNames.queenOfClubs,
        CardsNames.queenOfDiamonds,
        CardsNames.queenOfHearts,
        CardsNames.queenOfSpades,
        CardsNames.kingOfClubs,
        CardsNames.kingOfDiamonds,
        CardsNames.kingOfSpades,
      ];

      for (let i = 0; i < cards.length; i++) {
        const cardName = cards[i];
        if (
          (await this.generateCard(
            cardName,
            { saveContent, saveIpfs, path: 'tears' },
            { tears: true },
          )) == false
        ) {
          i -= 1;
        }
      }
    }

    this.logger.log('FAST GENERATED TEARS CARDS');

    for (let i = 0; i < 25; i++) {
      const cardName = [CardsNames.jokerBlack, CardsNames.jokerRed][
        Math.floor(Math.random() * 2)
      ];

      if (
        (await this.generateCard(cardName, {
          saveContent,
          saveIpfs,
          path: 'jokers',
        })) == false
      ) {
        i -= 1;
      }
    }

    this.logger.log('FAST GENERATED JOKER CARDS');

    if (calcUnique) {
      frequencyTraits(this.cards.all, 'background');
      frequencyTraits(this.cards.all, 'hair');
      frequencyTraits(this.cards.all, 'clothing');
      frequencyTraits(this.cards.all, 'suit');

      //jack
      frequencyTraits(this.cards['jack-of-clubs'], 'gold');
      frequencyTraits(this.cards['jack-of-diamonds'], 'axe');
      frequencyTraits(this.cards['jack-of-hearts'], 'spear');
      frequencyTraits(this.cards['jack-of-spades'], 'dagger');

      //queen
      frequencyTraits(this.cards['queen-of-clubs'], 'gold');
      frequencyTraits(this.cards['queen-of-clubs'], 'manicure');

      frequencyTraits(this.cards['queen-of-diamonds'], 'gold');
      frequencyTraits(this.cards['queen-of-diamonds'], 'axe');
      frequencyTraits(this.cards['queen-of-diamonds'], 'decoration');

      frequencyTraits(this.cards['queen-of-hearts'], 'gold');

      frequencyTraits(this.cards['queen-of-spades'], 'manicure');
      frequencyTraits(this.cards['queen-of-spades'], 'silver');

      //king
      frequencyTraits(this.cards['king-of-clubs'], 'gold');
      frequencyTraits(this.cards['king-of-clubs'], 'decoration');

      frequencyTraits(this.cards['king-of-diamonds'], 'gold');

      frequencyTraits(this.cards['king-of-hearts'], 'gold');
      frequencyTraits(this.cards['king-of-hearts'], 'egg');
      frequencyTraits(this.cards['king-of-hearts'], 'decoration');

      frequencyTraits(this.cards['king-of-spades'], 'gold');
      frequencyTraits(this.cards['king-of-spades'], 'decoration');
      frequencyTraits(this.cards['king-of-spades'], 'silver');

      //joker
      frequencyTraits(this.cards['joker-black'], 'backgroundDecor');
      frequencyTraits(this.cards['joker-red'], 'backgroundDecor');

      //unique
      frequencyTraits(this.cards['unique-jack-of-diamonds'], 'axe');
      frequencyTraits(this.cards['unique-jack-of-hearts'], 'spear');
      frequencyTraits(this.cards['unique-jack-of-spades'], 'dagger');

      frequencyTraits(this.cards['unique-queen-of-clubs'], 'gold');
      frequencyTraits(this.cards['unique-queen-of-clubs'], 'manicure');

      frequencyTraits(this.cards['unique-queen-of-spades'], 'manicure');
      frequencyTraits(this.cards['unique-queen-of-spades'], 'silver');

      frequencyTraits(this.cards['unique-king-of-diamonds'], 'gold');

      frequencyTraits(this.cards['unique-king-of-hearts'], 'gold');
      frequencyTraits(this.cards['unique-king-of-hearts'], 'egg');
      frequencyTraits(this.cards['unique-king-of-hearts'], 'decoration');

      const faces = {
        Jack: 0,
        Queen: 0,
        King: 0,
        Joker: 0,
      };
      const suits = {
        Clubs: 0,
        Diamonds: 0,
        Hearts: 0,
        Spades: 0,
        Red: 0,
        Black: 0,
      };

      this.cards.all.forEach((card: Card) => {
        faces[card.face]++;
        suits[card.suit]++;
      });

      this.cards.all.forEach(async (card: Card) => {
        card.metadata.faceFrequency = faces[card.face] / this.cards.all.length;
        card.metadata.suitFrequency = suits[card.suit] / this.cards.all.length;

        let maxRarity = 0;
        let mediumRarity = 0;
        let frequencyRarity = 1;

        const traits = card.metadata.traits;
        for (const traitName in traits) {
          const trait = traits[traitName];
          //description += `Trait: ${trait.main.name}, Color: ${trait.main.color.name}, Frequency: ${trait.frequency * 100}%\n`;
          if (trait.rarity > maxRarity) {
            maxRarity = trait.rarity;
          }
          if (trait.rarity) {
            mediumRarity += trait.rarity;
          }

          frequencyRarity *= 1 - trait.frequency / 100;
        }
        card.metadata.maxRarity = maxRarity;
        card.metadata.mediumRarity = mediumRarity / Object.keys(traits).length;
        card.metadata.frequencyRarity = (1 - frequencyRarity) * 100;
      });
    }

    if (saveDB) {
      for (const card of this.cards.all) {
        await this.cardRepository.create(card);
      }
    }
    this.logger.log('FAST GENERATED');
  }
}
