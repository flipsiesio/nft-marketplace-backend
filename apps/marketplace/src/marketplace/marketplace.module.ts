import { Global, Module } from '@nestjs/common';
import { CardsModule } from '@app/common/nft';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from '@app/config/postgres';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, SchemaCard } from 'apps/cards-cli/src/models/card';
import { MarketplaceService } from './marketplace.service';
import { MongoConfig } from '@app/config/mongo';
import { EventsModule } from '../events/events.module';
import { StateSaleEntity } from '../events/entities/state-sale.entity';
import { StateBidEntity } from '../events/entities/state-bid.entity';
import { CardEntity } from '../events/entities/card.entity';
import { EventsSaleEntity } from '../events/entities/events-sale.entity';
import { EventsBidEntity } from '../events/entities/events-bid.entity';
import { TronHeadModule } from '@app/common/tronhead';
import { SaleAndMintEntity } from '../events/entities/sale-and-mint.entity';
import { Web3ConnectorModule } from '@app/blockchain/connectors/web3-connector/web3-connector.module';
import { Web3AbiLoader } from '@app/blockchain/connectors/web3-connector/core';
import { join } from 'path';
import { BTTCContractsConfig } from '@app/config/bttc';
import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';

@Global()
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
    TypeOrmModule.forFeature([
      StateSaleEntity,
      StateBidEntity,
      EventsSaleEntity,
      EventsBidEntity,
      CardEntity,
      SaleAndMintEntity,
      StateSaleEntity,
    ]),
    TronHeadModule,
    CardsModule,
    Web3ConnectorModule.forRoot(
      new Web3AbiLoader(join(process.cwd(), 'files', 'abi')),
      {url: BTTCContractsConfig.URL, connectionType: Web3ConnectionTypeEnum.HTTP},
    ),

    MongooseModule.forRoot(MongoConfig.MONGO_URI),
    MongooseModule.forFeature([{ name: Card.name, schema: SchemaCard }]),
  ],
  providers: [
    MarketplaceService,
    //TODO uncomment
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
