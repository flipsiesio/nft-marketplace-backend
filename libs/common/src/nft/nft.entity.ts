import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // ManyToOne,
} from 'typeorm';
// import { User } from '../users/user.entity';
// import { CardsSuitEnum } from './enums/cards-suit.enum';
// import { CardsTypeEnum as CardsFaceEnum } from './enums/cards-type.enum';

@Entity({ name: 'Card' }) //
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ type: 'text', nullable: true })
  name: string; // metadata name

  @Column({ type: 'text', nullable: true })
  description: string; // metadata description

  @Column({ type: 'text', name: 'image_cid', nullable: true })
  imageCid: string; // IPFS image CID

  @Column({ type: 'text', name: 'image_file', nullable: true })
  imageFile: string; // server filesystem image path

  @Column({ type: 'text', name: 'metadata_cid', nullable: true })
  metadataCid: string; // IPFS metadata CID

  // @ManyToOne(() => User)
  @Column({ type: 'text', name: 'owner', nullable: true })
  owner: string;

  @Column({ type: 'text', name: 'suit', nullable: true })
  suit: string;

  @Column({ type: 'real', name: 'suit_rarity', nullable: true })
  suitRarity: number;

  @Column({ type: 'text', name: 'face', nullable: true })
  face: string;

  @Column({ type: 'real', name: 'face_rarity', nullable: true })
  faceRarity: number;

  @Column({ type: 'text', name: 'clothes', nullable: true })
  clothes: string;

  @Column({ type: 'real', name: 'clothes_rarity', nullable: true })
  clothesRarity: number;

  @Column({ type: 'text', name: 'background', nullable: true })
  background: string;

  @Column({ type: 'real', name: 'background_rarity', nullable: true })
  backgroundRarity: number;

  @Column({ type: 'text', name: 'hair', nullable: true })
  hair: string;

  @Column({ type: 'real', name: 'hair_rarity', nullable: true })
  hairRarity: number;

  @Column({ type: 'text', name: 'borderline', nullable: true })
  borderline: string;

  @Column({ type: 'real', name: 'borderline_rarity', nullable: true })
  borderlineRarity: number;

  @Column({ type: 'text', name: 'egg', nullable: true })
  egg: string;

  @Column({ type: 'real', name: 'egg_rarity', nullable: true })
  eggRarity: number;

  @Column({ type: 'text', name: 'teardrop', nullable: true })
  teardrop: string;

  @Column({ type: 'real', name: 'teardrop_rarity', nullable: true })
  teardropRarity: number;
}
