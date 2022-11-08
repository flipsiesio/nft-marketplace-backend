// import { ColorDto } from '@app/common/nft/dto/color.dto';

export enum Trait {
  Suit = 'suit',
  Face = 'face',
  Background = 'background',
  Hair = 'hair',
  Clothes = 'clothes',
  Borderline = 'borderline',
  Teardrop = 'teardrop',
  Egg = 'egg',
}

export interface Attribute {
  trait_type: Trait;
  value: string | boolean; // ColorDto
}

export interface NftMetadata {
  name: string;
  description: string;
  attributes: Array<Attribute>;
  background_color: string;
}
