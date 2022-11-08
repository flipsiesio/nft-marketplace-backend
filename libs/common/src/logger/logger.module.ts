import * as path from 'path';
import { Module } from '@nestjs/common';
import { LoggerService } from 'nest-logger';
import { LoggerConfig } from '@app/config/logger';

@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: () => {
        const loggers = [
          LoggerService.console({
            colorize: LoggerConfig.LOGS_COLORIZE,
          }),
          LoggerService.rotate({
            colorize: false,
            fileOptions: {
              filename: path.join(LoggerConfig.LOGS_PATH, '%DATE%.log'),
            },
          }),
        ];
        return new LoggerService(LoggerConfig.LOGS_LEVEL, loggers);
      },
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
