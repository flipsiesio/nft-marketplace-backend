// import * as fs from 'fs/promises';
// import * as path from 'path';
// import { createHash } from 'crypto';
// import { InternalServerErrorException, Logger } from '@nestjs/common';
// import * as svgParser from 'svg-parser';
// import * as ntc from 'ntc';
// import { NftService } from '@app/common/nft';
// import Options from './options.interface';
// import { NftMetadata, Trait, Attribute } from './metadata.interface';
// import { Tag } from './tag.interface';
// import { FindOperator, In, Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Card } from '@app/common/nft/nft.entity';
// import { ColorService } from '../color.service';
// import nftsSchema from './nftsSchema';
// import { NftsSuitEnum } from '@app/common/nft/enums/nft-suit.enum';
// import { NftsFaceEnum } from '@app/common/nft/enums/nft-face.enum';

// // const count = nftsParams.count; // 7803
// // const rareCardsCount = 7;  // regular playing cards as featured in the Flipsies poker game
// // const colorozedCardsCount = 6500; // cards with altered hair, clothes, background and border line color
// // const jokersCardsCount = 25; //
// // const eggCardsCount = 771; // cards with eggs
// // const teardropsCardsCount = 500; // cards with teardrops
// /*
//   Expected svg structure:
//   <svg>
//     <g id='CARD_ID'>
//       <g id='ELEMENT_ID'>
//         <path fill='#HEX_COLOR'/>
//       </g>
//     </g>
//     <defs/>
//   </svg>
// */

// // @Console()
// export class CardsCliService {
//   private readonly logger = new Logger();
//   private nftSchemaLimits = { totalCount: 0 };
//   private generatedNftList = [];

//   constructor(
//     private readonly colorService: ColorService,
//     @InjectRepository(Card) private cardRepository: Repository<Card>,
//   ) {}

//   stats = {
//     [Trait.Background]: {},
//     [Trait.Clothes]: {},
//     [Trait.Borderline]: {},
//     [Trait.Hair]: {},
//     [Trait.Teardrop]: {},
//     [Trait.Egg]: {},
//     [Trait.Suit]: {},
//     [Trait.Face]: {},
//   };

//   TAGS_ALIASES = {
//     background: Trait.Background,
//     clothing: Trait.Clothes,
//     cardSuit: Trait.Borderline,
//     hair: Trait.Hair,
//     drop: Trait.Teardrop,
//     eggs: Trait.Egg,
//   };

//   // storage of all cards. user for calc uniq percent
//   allCards = [];
//   // storage of uniq description of all the cards. used for check uniqueness
//   allCardsDescription = [];

//   async getCards() {
//     const result = await this.cardRepository.count();
//     return result;
//   }

//   async genCardsPlan() {
//     // count of cards
//     let colorizedCount = nftsSchema.count.colorized;
//     let tearsCount = nftsSchema.count.tears;
//     let eggsCount = nftsSchema.count.eggs;
//     // generate and push cards into db
//     const colorizedGenCards: Card[] = await this.generate({
//       cardsCount: colorizedCount,
//       teardropIsOn: false,
//       eggIsOn: false,
//     });
//     const tearsGenCards: Card[] = await this.generate({
//       cardsCount: tearsCount,
//       teardropIsOn: true,
//       eggIsOn: false,
//     });
//     const eggsGenCards: Card[] = await this.generate({
//       cardsCount: eggsCount,
//       teardropIsOn: false,
//       eggIsOn: true,
//     });
//     // check uniqueness
//     // original cards sets
//     const colorizedOrigPath = 'apps/cards-cli/src/cards/generated/colorized';
//     const tearsOrigPath = 'apps/cards-cli/src/cards/generated/tears';
//     const eggsOrigPath = 'apps/cards-cli/src/cards/generated/eggs';
//     // path to save generated cards
//     const colorizedPathToSave = 'apps/cards-cli/src/cards';
//     const tearsPathToSave = 'apps/cards-cli/src/cards';
//     const eggsPathToSave = 'apps/cards-cli/src/cards';
//     // render cards
//     const colorizedIsRendered: boolean = await this.renderCards({
//       origCardsPath: colorizedOrigPath,
//       pathToSave: colorizedPathToSave,
//       cardsArr: colorizedGenCards,
//     });
//     const tearsIsRendered: boolean = await this.renderCards({
//       origCardsPath: tearsOrigPath,
//       pathToSave: tearsPathToSave,
//       cardsArr: tearsGenCards,
//     });
//     const eggsIsRendered: boolean = await this.renderCards({
//       origCardsPath: eggsOrigPath,
//       pathToSave: eggsPathToSave,
//       cardsArr: eggsGenCards,
//     });
//   }

//   async renderCards({
//     origCardsPath,
//     pathToSave,
//     cardsArr,
//   }: {
//     origCardsPath: string;
//     pathToSave: string;
//     cardsArr: Card[];
//   }): Promise<boolean> {
//     return true;
//   }

//   calcUniquenessPercent(arr) {
//     const vector = [
//       [0, 1],
//       [2, 1],
//     ];
//     // let allBack = this.allCards.map(item => item.background);
//     // let uniqBack = new Set(allBack);
//     // console.log(uniqBack.size, allBack.length);
//     // for (let bgColor of uniqBack) {
//     //   let filteredArr = allBack.filter(item => item === bgColor);
//     //   console.log(bgColor, filteredArr.length, uniqBack.size, filteredArr.length / uniqBack.size * 100, "%", filteredArr.length / nftsSchema.count.colorized * 100, "%");
//     // }
//     // console.log(this.allCardsDescription.length);
//     // return this.errorCount;
//   }

//   async generate({
//     cardsCount,
//     eggIsOn,
//     teardropIsOn,
//   }: {
//     cardsCount: number;
//     eggIsOn: boolean;
//     teardropIsOn: boolean;
//   }): Promise<Card[]> {
//     try {
//       let errorCount = 0;
//       let cardsArr: Card[] = [];
//       for (let i = 0; i < cardsCount; i++) {
//         let card = this.genRandomCard({ index: i, eggIsOn, teardropIsOn });
//         // all cards must be unique
//         // check if description is already exist
//         if (!this.allCardsDescription.includes(card.description)) {
//           cardsArr.push(card);
//           this.allCards.push(card);
//           this.allCardsDescription.push(card.description);
//         } else {
//           errorCount++;
//           // if card is NOT uniq -> iterate one more time for right count of cards
//           i--;
//         }
//       }
//       const resultOfInsert = await this.cardRepository
//         .createQueryBuilder()
//         .insert()
//         .into(Card)
//         .values(cardsArr)
//         .execute();
//       console.log({ resultOfInsert, errorCount });
//       if (resultOfInsert) {
//         return cardsArr;
//       }
//       throw new InternalServerErrorException('cards not generated');
//     } catch (error) {
//       console.log(error);
//       return error;
//     }
//   }

//   replaceCardColors(colorSet: { [key: string]: string }): {
//     [key: string]: string;
//   } {
//     let newColorSet: { [key: string]: string } = {};
//     let keys: string[] = Object.keys(colorSet);
//     let values: string[] = Object.values(colorSet);
//     //background need to be black or white
//     let y: [string, string][] = [];
//     for (let i = 0; i < keys.length; i++) {
//       newColorSet[keys[i]] = this.colorService.getRandomColorData()[0];
//     }
//     return colorSet;
//   }

//   async replaceSvgColors(
//     filepath: string,
//     colorSet: { [key: string]: string },
//   ) {
//     const file = await fs.readFile(filepath, 'utf8');
//     // for
//     const regExp = new RegExp(colorSet[0]);
//     file.replace(regExp, '');
//   }

//   getRandArrItem(arr) {
//     return arr[Math.floor(Math.random() * arr.length)];
//   }

//   // [Trait.Background]: {},
//   // [Trait.Clothes]: {},
//   // [Trait.Borderline]: {},
//   // [Trait.Hair]: {},
//   // [Trait.Teardrop]: {},
//   // [Trait.Egg]: {},
//   // [Trait.Suit]: {},
//   // [Trait.Face]: {},

//   // standart color file
//   // standart svg file
//   // generate random cards obj
//   // generate nft metadata
//   // render cards -

//   getColorName(hex: string): string | boolean {
//     return this.colorService.nearestColor(hex)[1];
//   }

//   getCardsFiles() {
//     try {
//       // get files with colors
//       // change colors to standart
//       // save cards into DB
//       // return this.getRandArrItem(nftsSchema.face);
//     } catch (error) {
//       console.log(error);
//     }
//     // background -
//     // clothing -
//     // cardSuit -
//     // hair -
//     // drop  - drop teardrop
//     // eggs -
//   }

//   genRandomCard({
//     index,
//     eggIsOn,
//     teardropIsOn,
//   }: {
//     index: number;
//     eggIsOn: boolean;
//     teardropIsOn: boolean;
//   }): Card {
//     try {
//       let metadata = {
//         id: null,
//         imageCid: null,
//         imageFile: null,
//         metadataCid: null,
//         owner: null,
//         face: null, //cardsParams.face,
//         faceRarity: null, //cardsParams.face,
//         suit: null, //cardsParams.suit,
//         suitRarity: null,
//         background: null, //cardsParams.background,
//         backgroundRarity: null,
//         hair: null, //cardsParams.hair,
//         hairRarity: null,
//         clothes: null, //cardsParams.clothes,
//         clothesRarity: null,
//         borderline: null, //cardsParams.borderline,
//         borderlineRarity: null,
//         teardrop: null, //cardsParams.teardrop,
//         teardropRarity: null,
//         egg: null, //cardsParams.eggs,
//         eggRarity: null,
//         name: null,
//         description: null,
//         hash: null,
//       };
//       metadata.face = this.getRandArrItem(nftsSchema.face);
//       metadata.suit = this.getRandArrItem(nftsSchema.suit);
//       metadata.background = this.colorService.getRandomColorData()[0];
//       metadata.hair = this.colorService.getRandomColorData()[0];
//       metadata.clothes = this.colorService.getRandomColorData()[0];
//       metadata.borderline = this.colorService.getRandomColorData()[0];
//       if (eggIsOn) {
//         if (
//           metadata.face === NftsFaceEnum.King &&
//           metadata.suit === NftsSuitEnum.Hearts
//         ) {
//           metadata.egg = this.colorService.getRandomColorData()[0];
//         }
//       }
//       if (teardropIsOn) metadata.teardrop = true;
//       let description =
//         `Flipsies ${this.capitalize(metadata.face)} of ${this.capitalize(
//           metadata.suit,
//         )} ` +
//         `playing card with ${this.getColorName(metadata.clothes)} clothing, ` +
//         `${this.getColorName(metadata.hair)} hair, ${this.getColorName(
//           metadata.borderline,
//         )} borderline, ` +
//         `${this.getColorName(metadata.background)} background`;
//       if (metadata.hasOwnProperty('egg') && metadata.egg)
//         description += `, ${this.getColorName(metadata.egg)} colored egg`;
//       if (metadata.hasOwnProperty('teardrop' && metadata.teardrop))
//         description += ' and a teardrop';
//       const hashedDescription = createHash('sha256')
//         .update(description)
//         .digest('hex');
//       metadata.hash = hashedDescription;
//       metadata.name = `Flipsies #${index} ${hashedDescription}`;
//       metadata.description = description;
//       return metadata;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   check() {
//     // return this.getCardsFiles();
//     // let targetCount = nftsSchema.count;
//     // let uniqueNfts = (new Set(this.generatedNftList)).size;
//     // let resultCount = this.generatedNftList.length;
//     // return { targetCount, uniqueNfts, resultCount };
//   }

//   async create(dto) {
//     try {
//       return await this.cardRepository.insert(dto);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   // getProperty(data) {
//   //   let properties = Object.keys(data); // ['snow', 'black', 'blue']
//   //   properties.sort(() => Math.random() - 0.5); // randomize properties
//   //   for (let i = 0; i < properties.length; i++) {
//   //     let property = properties[i];
//   //     if (!this.nftSchemaLimits.hasOwnProperty(property)) this.nftSchemaLimits[property] = property;
//   //     if (!this.nftSchemaLimits[property].hasOwnProperty('count')) this.nftSchemaLimits[property].count = 0;
//   //     if (this.nftSchemaLimits[property].count < data[property].count) {
//   //       this.nftSchemaLimits[property].count++;
//   //       this.nftSchemaLimits.totalCount++;
//   //       return property;
//   //     }
//   //   }
//   //   return null; // all properties on limit
//   // }

//   // @Command({
//   //   command: 'parse <filepath>',
//   //   options: [
//   //     {
//   //       flags: '-s, --stats',
//   //       required: false,
//   //       description: 'Collect statistics',
//   //     },
//   //     {
//   //       flags: '-o, --output <output>',
//   //       required: false,
//   //       description: 'Output destination path',
//   //     },
//   //   ],
//   // })
//   // async run(filepath: string, options: Options): Promise<void> {
//   //   const { stats, output } = options;
//   //   if (stats) {
//   //     this.shouldSaveStats = true;
//   //   }
//   //   if (output) {
//   //     const outputStat = await fs.stat(output);
//   //     if (!outputStat.isDirectory())
//   //       throw new Error('Output parameter must point to directory');
//   //   }
//   //   const files = await this.getSvgFiles(filepath);
//   //   // let totalCount = 0;
//   //   for (const file of files) {
//   //     const fileData = await this.parseFile(file);
//   //     // totalCount += 1;
//   //     this.saveStats(fileData);
//   //     const metadata = this.formatToNftMetadata(fileData);
//   //     this.saveDataToFile(metadata, file, output);
//   //     // const dbData = this.formatToDatabaseRecord(metadata, file);
//   //   }
//   // }

//   // saveStats(fileData: Record<Trait, string | boolean>): void {
//   //   if (!this.shouldSaveStats) return;
//   //   for (const [trait, value] of Object.entries(fileData)) {
//   //     if (!this.stats[trait][value]) {
//   //       this.stats[trait][value] = 1;
//   //     } else {
//   //       this.stats[trait][value] += 1;
//   //     }
//   //   }
//   // }

//   getMetadataAttributeValue(
//     trait: string,
//     value: string /* | ColorDto*/ | boolean,
//   ) {
//     switch (trait) {
//       case Trait.Face:
//       case Trait.Suit:
//       case Trait.Teardrop:
//         return value;
//       case Trait.Clothes:
//       case Trait.Hair:
//       case Trait.Borderline:
//       case Trait.Background:
//         return value[0].slice(1);
//       case Trait.Egg:
//         return value ? value[0] ?? value[1] : value;
//     }
//   }

//   getMetadataAttributes(
//     traits: Record<Trait, string | boolean>,
//   ): Array<Attribute> {
//     const attributes = [];
//     for (const [trait, value] of Object.entries(traits)) {
//       attributes.push({
//         // eslint-disable-next-line
//         trait_type: trait,
//         value: this.getMetadataAttributeValue(trait, value),
//       });
//     }
//     return attributes;
//   }

//   capitalize(word: string): string {
//     const lowered = word.toLocaleLowerCase();
//     return lowered.charAt(0).toUpperCase() + lowered.slice(1);
//   }

//   // formatToNftMetadata(fileData): NftMetadata {
//   //   let description = `Flipsies ${this.capitalize(
//   //     fileData[Trait.Face],
//   //   )} of ${this.capitalize(fileData[Trait.Suit])} playing card with ${fileData[Trait.Clothes][1]
//   //     } clothing, ${fileData[Trait.Hair][1]} hair, ${fileData[Trait.Borderline][1]
//   //     } borderline, ${fileData[Trait.Background][1]} background`;
//   //   if (fileData[Trait.Egg]) {
//   //     description += `, ${fileData[Trait.Egg][1]} colored egg`;
//   //   }
//   //   if (fileData[Trait.Teardrop]) {
//   //     description += ' and a teardrop';
//   //   }
//   //   const hashedDescription = createHash('sha256')
//   //     .update(description)
//   //     .digest('hex');
//   //   const metadata = {
//   //     name: `Flipsies #${hashedDescription}`,
//   //     description,
//   //     // TODO: Get CID from image file in IPFS
//   //     image: null,
//   //     attributes: this.getMetadataAttributes(fileData),
//   //     // eslint-disable-next-line
//   //     background_color: 'FFFFFF',
//   //   };
//   //   return metadata;
//   // }

//   // async formatToDatabaseRecord(
//   //   data: NftMetadata,
//   //   // filepath: string,
//   // ): Promise<void> {
//   //   const colorProps = [
//   //     Trait.Background,
//   //     Trait.Clothes,
//   //     Trait.Borderline,
//   //     Trait.Hair,
//   //     Trait.Teardrop,
//   //     Trait.Egg,
//   //   ];
//   //   for (let colorProp of colorProps) {
//   //     // await this.colorsService.upsert(data[colorProp]);
//   //   }
//   // }

//   // async getStatsFilepath(filepath: string): Promise<string> {
//   //   let statsFilepath = await fs.stat(filepath);
//   //   if (statsFilepath.isDirectory()) {
//   //     return filepath;
//   //   } else {
//   //     return path.dirname(filepath);
//   //   }
//   // }

//   // async getSvgFiles(filepath: string): Promise<Array<string>> {
//   //   let files = [];
//   //   const stats = await fs.stat(filepath);
//   //   if (stats.isDirectory()) {
//   //     console.log(new Date(), `Found directory ${filepath}`);
//   //     const dirContent = await fs.readdir(filepath);
//   //     for (const element of dirContent) {
//   //       const elementFilepath = path.join(filepath, element);
//   //       files = files.concat(await this.getSvgFiles(elementFilepath));
//   //     }
//   //   } else if (stats.isFile()) {
//   //     if (path.extname(filepath) === this.SVG_EXT) {
//   //       console.log(new Date(), `Found file ${filepath}`);
//   //       files.push(filepath);
//   //     }
//   //   }
//   //   return files;
//   // }

//   // async parseFile(filepath: string): Promise<Record<Trait, string | boolean>> {
//   //   const file = await fs.readFile(filepath, 'utf8');

//   //   let root = svgParser.parse(file);

//   //   const idGroup = root.children[0].children[0];
//   //   const id = idGroup.properties.id;
//   //   const [face, suit] = id.split('_OF_');

//   //   const traits = {
//   //     [Trait.Face]: face,
//   //     [Trait.Suit]: suit,
//   //     [Trait.Teardrop]: false,
//   //     [Trait.Egg]: false,
//   //     [Trait.Background]: null,
//   //     [Trait.Clothes]: null,
//   //     [Trait.Borderline]: null,
//   //     [Trait.Hair]: null,
//   //   };

//   //   for (let groupTag of idGroup.children) {
//   //     const groupId = groupTag.properties.id;
//   //     if (!(groupId in this.TAGS_ALIASES)) continue;

//   //     for (const pathTag of groupTag.children) {
//   //       if (pathTag.properties.fill) {
//   //         const color = pathTag.properties.fill;
//   //         if (groupId === 'drop') {
//   //           traits[this.TAGS_ALIASES[groupId]] = true;
//   //           break;
//   //         }
//   //         if (color === 'url(#pattern0)') {
//   //           traits[this.TAGS_ALIASES[groupId]] = this.getAbstractColor(root);
//   //         } else {
//   //           traits[this.TAGS_ALIASES[groupId]] = ntc.name(color);
//   //         }
//   //         break;
//   //       }
//   //     }
//   //   }
//   //   return traits;
//   // }

//   // getAbstractColor(rootTag: Tag): [null, string, boolean] {
//   //   const defs = rootTag.children[0].children[1].children;
//   //   let abstractColor;
//   //   for (const def of defs) {
//   //     if (def.tagName === 'image') {
//   //       abstractColor = def.properties['data-name'];
//   //       break;
//   //     }
//   //   }
//   //   let index = this.abstractColors.indexOf(abstractColor);
//   //   if (index === -1) {
//   //     index = this.abstractColors.push(abstractColor);
//   //   }
//   //   return [null, `Abstract Color #${index}`, false];
//   // }

//   // async saveDataToFile<T>(data: T, filepath: string, output?: string) {
//   //   const { dir, name } = path.parse(filepath);
//   //   let resultingFilepath = path.join(output || dir, name) + '.json';
//   //   await fs.writeFile(resultingFilepath, JSON.stringify(data), {
//   //     flag: 'w+',
//   //   });
//   // }

//   // metadata.suit = this.getProperty(nftsSchema.suit);
//   // metadata.suitRarity = parseFloat(nftsSchema.suit[metadata.suit].percentage);
//   // metadata.face = this.getProperty(nftsSchema.face);
//   // metadata.faceRarity = parseFloat(nftsSchema.face[metadata.face].percentage);
//   // metadata.background = this.getProperty(nftsSchema.background);
//   // metadata.backgroundRarity = parseFloat(nftsSchema.background[metadata.background].percentage);
//   // metadata.hair = this.getProperty(nftsSchema.hair);
//   // metadata.hairRarity = parseFloat(nftsSchema.hair[metadata.hair].percentage);
//   // metadata.clothes = this.getProperty(nftsSchema.clothes);
//   // metadata.clothesRarity = parseFloat(nftsSchema.clothes[metadata.clothes].percentage);
//   // metadata.borderline = this.getProperty(nftsSchema.borderline);
//   // metadata.borderlineRarity = parseFloat(nftsSchema.borderline[metadata.borderline].percentage);
//   // metadata.teardrop = this.getProperty(nftsSchema.teardrop);
//   // metadata.teardropRarity = parseFloat(nftsSchema.teardrop[metadata.teardrop].percentage);
//   // metadata.egg = this.getProperty(nftsSchema.egg);
//   // metadata.eggRarity = parseFloat(nftsSchema.egg[metadata.egg].percentage);
//   // metadata.name = `Flipsies #${index}`;
//   // metadata.description = metadata.face + ' '
//   //   + metadata.suit + ' '
//   //   + metadata.background
//   //   + metadata.hair + ' '
//   //   + metadata.clothes + ' '
//   //   + metadata.borderline + ' '
//   //   + metadata.teardrop + ' '
//   //   + metadata.egg;
//   // metadata.imageCid = index.toString();
//   // metadata.imageFile = index.toString();
//   // metadata.metadataCid = index.toString();
//   // metadata.owner = index.toString();
//   // return metadata;
// }
