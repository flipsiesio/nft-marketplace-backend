import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsGenerate } from './cards-generate';
import { Card, SchemaCard } from './models/card';
import { CardsTraits } from './cards-traits';
import { ColorService } from './color.service';
import { CardsCliController } from './cards-cli.controller';
import { IpfsModule } from '@app/common/ipfs';
import { MongoConfig } from '@app/config/mongo';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: PostgresConfig.POSTGRES_HOST,
    //   port: PostgresConfig.POSTGRES_PORT,
    //   username: PostgresConfig.POSTGRES_USERNAME,
    //   password: PostgresConfig.POSTGRES_PASSWORD,
    //   database: PostgresConfig.POSTGRES_DATABASE,
    //   synchronize: true, //false,
    //   autoLoadEntities: true,
    // }),
    MongooseModule.forRoot(MongoConfig.MONGO_URI),
    // MongooseModule.forRoot(
    //   `mongodb://root:rootpassword@${
    //     process.env.NODE_ENV != 'production'
    //       ? 'localhost:17017'
    //       : 'mongodb:27017'
    //   }/?authMechanism=DEFAULT`,
    // ),
    MongooseModule.forFeature([{ name: Card.name, schema: SchemaCard }]),
    IpfsModule,
    //TypeOrmModule.forFeature([Card]),
    //ConsoleModule,
    //CardsModule,
  ],
  controllers: [CardsCliController], //[CardsCliController],
  providers: [CardsTraits, CardsGenerate, ColorService], //[CardsCliService, ColorService],
  exports: [CardsTraits, CardsGenerate], //[CardsCliService],
})
export class CardsCliModule {}
