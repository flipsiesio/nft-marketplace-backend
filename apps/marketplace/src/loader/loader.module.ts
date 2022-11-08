import { MongoConfig } from '@app/config/mongo';
import { PostgresConfig } from '@app/config/postgres';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card, SchemaCard } from 'apps/cards-cli/src/models/card';
import { CardEntity } from '../events/entities/card.entity';
import { LoaderService } from './loader.service';

@Module({
  imports: [
    MongooseModule.forRoot(MongoConfig.MONGO_URI),
    MongooseModule.forFeature([{ name: Card.name, schema: SchemaCard }]),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: PostgresConfig.POSTGRES_HOST,
      port: PostgresConfig.POSTGRES_PORT,
      username: PostgresConfig.POSTGRES_USERNAME,
      password: PostgresConfig.POSTGRES_PASSWORD,
      database: PostgresConfig.POSTGRES_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([CardEntity]),
  ],
  providers: [LoaderService],
  exports: [LoaderService],
})
export class LoaderModule {}
