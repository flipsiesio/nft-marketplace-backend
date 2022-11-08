import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsEntity } from './events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventsEntity])],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
