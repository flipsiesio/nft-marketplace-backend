import { get } from 'env-var';

export class BTTCContractsConfig {
  public static readonly CONTRACT_CARD: string = get('CONTRACT_BTTC_CARD')
    .required()
    .asString();

  public static readonly BTTC_CARD_DEPLOYMENT_HASH: string = get('BTTC_CARD_DEPLOYMENT_HASH')
    .required()
    .asString();

  public static readonly BTTC_CARD_DEPLOYMENT_BLOCK: number = get('BTTC_CARD_DEPLOYMENT_BLOCK')
    .required()
    .asInt();

  public static readonly CONTRACT_NFT_SALE: string = get('CONTRACT_BTTC_NFT_SALE')
    .required()
    .asString();

  public static readonly BTTC_NFT_SALE_DEPLOYMENT_HASH: string = get('BTTC_NFT_SALE_DEPLOYMENT_HASH')
    .required()
    .asString();

  public static readonly BTTC_NFT_SALE_DEPLOYMENT_BLOCK: number = get('BTTC_NFT_SALE_DEPLOYMENT_BLOCK')
    .required()
    .asInt();

  public static readonly CONTRACT_NFT_MARKETPLACE: string = get(
    'CONTRACT_BTTC_NFT_MARKETPLACE',
  )
    .required()
    .asString();

  public static readonly BTTC_NFT_MARKETPLACE_DEPLOYMENT_HASH: string = get('BTTC_NFT_MARKETPLACE_DEPLOYMENT_HASH')
    .required()
    .asString();

  public static readonly BTTC_NFT_MARKETPLACE_DEPLOYMENT_BLOCK: number = get('BTTC_NFT_MARKETPLACE_DEPLOYMENT_BLOCK')
    .required()
    .asInt();

  public static readonly CONTRACT_CARD_FACTORY: string = get(
    'CONTRACT_BTTC_CARD_FACTORY',
  )
    .required()
    .asString();

  public static readonly BTTC_CARD_FACTORY_DEPLOYMENT_HASH: string = get('BTTC_CARD_FACTORY_DEPLOYMENT_HASH')
    .required()
    .asString();

  public static readonly BTTC_CARD_FACTORY_DEPLOYMENT_BLOCK: number = get('BTTC_CARD_FACTORY_DEPLOYMENT_BLOCK')
    .required()
    .asInt();

  public static readonly CONTRACT_RANDOM_MINTER: string = get(
    'CONTRACT_BTTC_RANDOM_MINTER',
  )
    .required()
    .asString();

  public static readonly BTTC_RANDOM_MINTER_DEPLOYMENT_HASH: string = get('BTTC_RANDOM_MINTER_DEPLOYMENT_HASH')
    .required()
    .asString();

  public static readonly BTTC_RANDOM_MINTER_DEPLOYMENT_BLOCK: number = get('BTTC_RANDOM_MINTER_DEPLOYMENT_BLOCK')
    .required()
    .asInt();

  public static readonly URL: string = get(
    'URL',
  )
    .required()
    .asString();

  public static readonly BTTC_PRIVATE_KEY: string = get(
    'BTTC_PRIVATE_KEY',
  )
    .required()
    .asString();

  public static readonly BTTC_ADDRESS: string = get(
    'BTTC_ADDRESS',
  )
    .required()
    .asString();
}
