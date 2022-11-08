import { Module } from '@nestjs/common';
import { FslogService } from './fslog.service';

@Module({
  providers: [FslogService],
  exports: [FslogService],
})
export class FslogModule {}
