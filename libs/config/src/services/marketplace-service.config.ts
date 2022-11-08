import { get } from 'env-var';

export class MarketplaceServiceConfig {
  public static readonly CONTAINER_NAME: string = get(
    'MARKETPLACE_SERVICE_CONTAINER_NAME',
  )
    .required()
    .asString();

  public static readonly HTTP_PORT: number = get(
    'MARKETPLACE_SERVICE_HTTP_PORT',
  )
    .required()
    .asPortNumber();
}
