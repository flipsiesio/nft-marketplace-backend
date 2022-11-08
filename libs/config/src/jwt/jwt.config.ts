import { get } from 'env-var';

export class JwtConfig {
  public static readonly JWT_SECRET: string = get('JWT_SECRET')
    .required()
    .asString();

  public static readonly JWT_ACCESS_EXPIRE: number = get('JWT_ACCESS_EXPIRE')
    .required()
    .asInt();

  public static readonly JWT_REFRESH_EXPIRE: number = get('JWT_REFRESH_EXPIRE')
    .required()
    .asInt();
}
