import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CardsModule } from './nft';
import { UsersModule } from './users';
import { TronModule } from './tron';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [CardsModule, UsersModule, TronModule, LoggerModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
