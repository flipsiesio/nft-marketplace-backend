import { get } from 'env-var';

export class PostgresConfig {
  public static readonly POSTGRES_DATABASE: string = get('POSTGRES_DATABASE')
    .required()
    .asString();

  public static readonly POSTGRES_HOST: string = get('POSTGRES_HOST')
    .required()
    .asString();

  public static readonly POSTGRES_PORT: number = get('POSTGRES_PORT')
    .required()
    .asPortNumber();

  public static readonly POSTGRES_USERNAME: string = get('POSTGRES_USERNAME')
    .required()
    .asString();

  public static readonly POSTGRES_PASSWORD: string = get('POSTGRES_PASSWORD')
    .required()
    .asString();
}
