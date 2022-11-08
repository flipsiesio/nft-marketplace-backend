import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '../events/events.module';
import { SalesModule } from '../sales/sales.module';
import { TronModule } from '../tron';
import { NftService } from './nft.service';
import { Card as NftCard } from './nft.entity';
import { PostgresConfig } from '@app/config/postgres';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, SchemaCard } from '../../../../apps/cards-cli/src/models/card';
import { MongoConfig } from '@app/config/mongo';
import { BlockchainModule } from '@app/blockchain';
import { join } from 'path';
import { Web3ConnectorModule } from '@app/blockchain/connectors/web3-connector/web3-connector.module';
import { Web3AbiLoader } from '@app/blockchain/connectors/web3-connector/core';
import { BTTCContractsConfig } from '@app/config/bttc';
import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';
import { CardEntity } from 'apps/marketplace/src/events/entities/card.entity';

@Module({
  imports: [
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
    TronModule,
    Web3ConnectorModule.forRoot(
      new Web3AbiLoader(join(process.cwd(), 'files', 'abi')),
      {
        url: BTTCContractsConfig.URL,
        connectionType: Web3ConnectionTypeEnum.HTTP,
      },
    ),
    BlockchainModule,
    //EventsModule,
    //SalesModule,
    TypeOrmModule.forFeature([CardEntity]),

    MongooseModule.forRoot(MongoConfig.MONGO_URI), //`mongodb://root:rootpassword@${process.env.NODE_ENV == 'development' ? 'localhost:17017' : 'mongodb:27017' }/?authMechanism=DEFAULT`),
    MongooseModule.forFeature([{ name: Card.name, schema: SchemaCard }]),
  ],
  providers: [NftService], // ColorsService
  exports: [NftService], // ColorsService
})
export class CardsModule {}
