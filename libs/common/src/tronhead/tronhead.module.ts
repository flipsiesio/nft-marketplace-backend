import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Agent } from 'https';
import { TronModule } from '../tron/tron.module';
import { TronHeadService } from './tronhead.service';
import { RequestModule } from '../request/request.module';

@Module({
  imports: [RequestModule, TronModule],
  providers: [TronHeadService],
  exports: [TronHeadService],
})
export class TronHeadModule {}
