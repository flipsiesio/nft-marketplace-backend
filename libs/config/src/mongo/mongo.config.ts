import { get } from 'env-var';

export class MongoConfig {
  public static readonly MONGO_HOST: string = get('MONGO_HOST')
    .required()
    .asString();

  public static readonly MONGO_PORT: number = get('MONGO_PORT')
    .required()
    .asPortNumber();

  public static readonly MONGO_USER: string = get('MONGO_USER')
    .required()
    .asString();

  public static readonly MONGO_PASSWORD: string = get('MONGO_PASSWORD')
    .required()
    .asString();

  public static readonly MONGO_URI: string = `mongodb://${get('MONGO_USER')
    .required()
    .asString()}:${get('MONGO_PASSWORD').required().asString()}@${get(
    'MONGO_HOST',
  )
    .required()
    .asString()}:${get('MONGO_PORT')
    .required()
    .asPortNumber()}/?authMechanism=DEFAULT`;
}
