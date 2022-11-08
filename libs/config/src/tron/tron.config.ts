import { get } from 'env-var';

export class TronConfig {
  public static readonly PROVIDER_LINK: string = get('PROVIDER_LINK')
    .required()
    .asString();

  public static readonly API_HEADER: string = get('API_HEADER')
    .required()
    .asString();

  public static readonly API_KEY: string = get('API_KEY').required().asString();

  public static readonly FULL_NODE: string = get('FULL_NODE')
    .required()
    .asString();

  public static readonly SOLIDITY_NODE: string = get('SOLIDITY_NODE')
    .required()
    .asString();

  public static readonly EVENT_SERVER: string = get('EVENT_SERVER')
    .required()
    .asString();

  public static readonly PRIVATE_KEY: string = get('PRIVATE_KEY')
    .required()
    .asString();

  public static readonly MARKETPLACE_ADDRESS: string = get(
    'MARKETPLACE_ADDRESS',
  )
    .required()
    .asString();

  public static readonly TRON_TRX_TOKEN_ID: string = get('TRON_TRX_TOKEN_ID')
    .required()
    .asString();
}
