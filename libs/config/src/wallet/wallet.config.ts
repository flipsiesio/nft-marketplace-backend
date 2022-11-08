import { get } from 'env-var';

export class WalletConfig {
  public static readonly ADDRESS: string = get('ADDRESS').required().asString();

  public static readonly PRIVATE_KEY: string = get('PRIVATE_KEY')
    .required()
    .asString();

  public static readonly PASS_PHRASE: string = get('PASS_PHRASE')
    .required()
    .asString();
}
