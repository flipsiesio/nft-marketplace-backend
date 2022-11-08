import { get } from 'env-var';

export class RedisConfig {
  public static readonly REDIS_HOST: string = get('REDIS_HOST')
    .required()
    .asString();

  public static readonly REDIS_PORT: number = get('REDIS_PORT')
    .required()
    .asPortNumber();
}
