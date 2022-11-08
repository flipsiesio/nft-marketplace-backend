import { get } from 'env-var';

export class LoggerConfig {
  public static readonly LOGS_PATH: string = get('LOGS_PATH')
    .required()
    .default('.')
    .asString();

  public static readonly LOGS_LEVEL: string = get('LOGS_LEVEL')
    .required()
    .default('info')
    .asString();

  public static readonly LOGS_COLORIZE: boolean = get('LOGS_COLORIZE')
    .default('true')
    .asBool();
}
