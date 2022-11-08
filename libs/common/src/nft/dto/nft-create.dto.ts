import { User } from '@app/common/users/user.entity';
// import { Color } from '../color.entity';
import { NftsSuitEnum } from '../enums/nft-suit.enum';
import { NftsFaceEnum } from '../enums/nft-face.enum';

export class CreateNftsDto {
  id: number;
  name: string; // metadata name
  description: string; // metadata description
  imageCid: string; // IPFS image CID
  imageFile: string; // server filesystem image path
  metadataCid: string; // IPFS metadata CID
  owner: User;
  suit: NftsSuitEnum;
  suitRarity: number;
  face: NftsFaceEnum;
  faceRarity: number;
  clothes: string; // Color
  clothesRarity: number;
  background: string; // Color
  backgroundRarity: number;
  hair: string; // Color
  hairRarity: number;
  borderline: string; // Color
  borderlineRarity: number;
  egg: string; // Color
  eggRarity: number;
  teardrop: boolean;
  teardropRarity: number;
}

// {
//     "name": "Flipsies ID",
//     "description": "{Queen} of {Hearts} card with {black} background, {white} hair, {green} borderline, {purple} clothes{ and a teardrop}",
//     "image": "ipfs://ipfs.address",
//     "attributes": [
//       { "trait_type": "suit", "value": "hearts" },
//       { "trait_type": "rank", "value": "queen" },
//       { "trait_type": "background", "value": "black" },
//       { "trait_type": "hair", "value": "white" },
//       { "trait_type": "clothes", "value": "purple" },
//       { "trait_type": "borderline", "value": "green" },
//       { "trait_type": "teardrop", "value": "yes" },
//       { "trait_type": "egg", "value": "no" }
//     ],
//     "background_color": "FFFFFF"
// }

// import { NftSuitEnum } from 'apps/marketplace/src/enums/nft-suit.enum';
// import {
//   Column,
//   Entity,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity({ name: 'cards' })
// export class Card {
//   @PrimaryGeneratedColumn()
//   id: number;

//   name: MetadataName // sha256 hash from description
//   description: MetadataDescription,

//   image_cid: string // IPFS image CID
//   image_file: string // server filesystem image path

//   metadata_cid: string // IPFS metadata CID

//   @CreateDateColumn()
//   createdAt?: Date;

//   @UpdateDateColumn()
//   updatedAt?: Date;

//   @Column({ name: 'owner', nullable: false })
//   // Foreign key to Users table
//   owner: string;

//   suit: NftSuitEnum,
//   suit_rarity: float,

//   rank: NftRankEnum,
//   rank_rarity: float,

//   clothes: Color,
//   clothes_rarity: float,

//   background: Color,
//   background_rarity: float,

//   hair: Color,
//   hair_rarity: float,

//   borderline: Color,
//   borderline_rarity: float,

//   egg: Color,
//   egg_rarity: float,

//   teardrop: boolean,
//   teardrop_rarity: float,
// }
