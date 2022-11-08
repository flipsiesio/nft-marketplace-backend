import { Module } from '@nestjs/common';
import { JackpotController } from './jackpot.controller';
import { JackpotService } from './jackpot.service';
import { TronModule } from '@app/common/tron';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from '@app/config/postgres';
import { HttpModule } from '@nestjs/axios';
import { Agent } from 'https';
import { JackpotWatchlistEntity } from './entities/jackpot-watchlist.entity';
import { CardRandomMinterEntity } from './entities/card-random-minter.entity';
import { RequestModule } from '@app/common/request/request.module';
import { TronHeadModule } from '@app/common/tronhead';
import { AuthModule } from 'apps/auth/src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '@app/config/jwt';
import { Web3ConnectorModule } from '@app/blockchain/connectors/web3-connector/web3-connector.module';
import { Web3AbiLoader } from '@app/blockchain/connectors/web3-connector/core';
import { join } from 'path';
import { BTTCContractsConfig } from '@app/config/bttc';
import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';
import { BlockchainModule } from '@app/blockchain';

@Module({
  imports: [
    RequestModule,
    // HttpModule.register({
    //   // timeout: 5000,
    //   maxRedirects: 5,
    //   httpsAgent: new Agent({
    //     rejectUnauthorized: false,
    //   }),
    //   transformResponse: [
    //     function (data) {
    //       return data;
    //     },
    //   ],
    // }),
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
    TypeOrmModule.forFeature([JackpotWatchlistEntity, CardRandomMinterEntity]),
    TronHeadModule,
    AuthModule,
    JwtModule.register({
      secret: JwtConfig.JWT_SECRET,
    }),
    Web3ConnectorModule.forRoot(
      new Web3AbiLoader(join(process.cwd(), 'files', 'abi')),
      {url: BTTCContractsConfig.URL, connectionType: Web3ConnectionTypeEnum.HTTP},
    ),
    BlockchainModule
  ],
  controllers: [JackpotController],
  providers: [JackpotService],
})
export class JackpotModule {}
