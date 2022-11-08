import { Module } from '@nestjs/common';
import { TronService } from './tron.service';

@Module({
  providers: [
    {
      provide: TronService,
      useFactory: async () => TronService.create(),
    },
  ],
  exports: [TronService],
})
export class TronModule {}
