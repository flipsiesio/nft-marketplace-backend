import { JwtConfig } from '@app/config/jwt';
import { PostgresConfig } from '@app/config/postgres';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'apps/auth/src/auth/auth.module';
import { CardEntity } from './events/entities/card.entity';
import { EventsBidEntity } from './events/entities/events-bid.entity';
import { EventsSaleEntity } from './events/entities/events-sale.entity';
import { StateBidEntity } from './events/entities/state-bid.entity';
import { StateSaleEntity } from './events/entities/state-sale.entity';
import { EventsModule } from './events/events.module';
import { LoaderModule } from './loader/loader.module';
import { MainMarketplaceController } from './main-marketplace.controller';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { Web3ConnectorModule } from '@app/blockchain/connectors/web3-connector/web3-connector.module';
import { Web3AbiLoader } from '@app/blockchain/connectors/web3-connector/core';
import { join } from 'path';
import { BTTCContractsConfig } from '@app/config/bttc';
import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';

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
    ]),
    Web3ConnectorModule.forRoot(
      new Web3AbiLoader(join(process.cwd(), 'files', 'abi')),
      {
        url: BTTCContractsConfig.URL,
        connectionType: Web3ConnectionTypeEnum.HTTP,
      },
    ),
    LoaderModule,
    AuthModule,
    JwtModule.register({
      secret: JwtConfig.JWT_SECRET,
    }),
    MarketplaceModule,
    EventsModule,
  ],
  controllers: [MainMarketplaceController],
})
export class MainMarketplaceModule {}
