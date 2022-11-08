import { get } from 'env-var';

export class AuthServiceConfig {
  public static readonly CONTAINER_NAME: string = get(
    'AUTH_SERVICE_CONTAINER_NAME',
  )
    .required()
    .asString();

  public static readonly HTTP_PORT: number = get('AUTH_SERVICE_HTTP_PORT')
    .required()
    .asPortNumber();
}
