import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfig } from '@app/config/redis';
import { JwtConfig } from '@app/config/jwt';
import { UsersModule } from '@app/common/users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from '@app/config/postgres';
import { CardsModule } from '@app/common/nft';
import { LoggerModule } from '@app/common/logger';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { TronHeadModule } from '@app/common/tronhead';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SalesModule } from '@app/common/sales/sales.module';
import { MarketplaceModule } from 'apps/marketplace/src/marketplace/marketplace.module';
import { BlockchainModule } from '@app/blockchain';
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
      synchronize: false,
      autoLoadEntities: true,
    }),
    RedisModule.forRoot({
      config: { port: RedisConfig.REDIS_PORT, host: RedisConfig.REDIS_HOST },
    }),
    UsersModule,
    CardsModule,
    SalesModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JwtConfig.JWT_SECRET,
    }),
    Web3ConnectorModule.forRoot(
      new Web3AbiLoader(join(process.cwd(), 'files', 'abi')),
      {
        url: BTTCContractsConfig.URL,
        connectionType: Web3ConnectionTypeEnum.HTTP,
      },
    ),
    TronHeadModule,
    LoggerModule,
    MarketplaceModule,
    BlockchainModule,
  ],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
