import { get } from 'env-var';

export class ContractsConfig {
  public static readonly CONTRACT_CARD: string = get('CONTRACT_CARD')
    .required()
    .asString();
  public static readonly CONTRACT_NFT_SALE: string = get('CONTRACT_NFT_SALE')
    .required()
    .asString();
  public static readonly CONTRACT_NFT_MARKETPLACE: string = get(
    'CONTRACT_NFT_MARKETPLACE',
  )
    .required()
    .asString();
  public static readonly CONTRACT_CARD_FACTORY: string = get(
    'CONTRACT_CARD_FACTORY',
  )
    .required()
    .asString();
  public static readonly CONTRACT_RANDOM_MINTER: string = get(
    'CONTRACT_RANDOM_MINTER',
  )
    .required()
    .asString();
}
