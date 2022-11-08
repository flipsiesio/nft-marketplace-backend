import { ContractCard } from './card.contract';
import { ContractCardFactory } from './cardFactory.contract';
import { ContractCardRandomMinter } from './cardRandomMinter.contract';
import { ContractMarketplace } from './marketplace.contract';
import { ContractSale } from './sale.contract';

export { TronContract } from './contract';

export type TronContractsType = {
  card: ContractCard;
  marketplace: ContractMarketplace;
  cardFactory: ContractCardFactory;
  cardRandomMinter: ContractCardRandomMinter;
  sale: ContractSale;
};

export const TronContracts = {
  card: ContractCard,
  marketplace: ContractMarketplace,
  cardFactory: ContractCardFactory,
  cardRandomMinter: ContractCardRandomMinter,
  sale: ContractSale,
};
