import { config } from 'dotenv';
config();

import { get } from 'env-var';

export class CardsCliServiceConfig {
  public static readonly CONTAINER_NAME: string = get(
    'CARDS_CLI_CONTAINER_NAME',
  )
    .required()
    .asString();

  public static readonly HTTP_PORT: number = get('CARDS_CLI_HTTP_PORT')
    .required()
    .asPortNumber();
}
