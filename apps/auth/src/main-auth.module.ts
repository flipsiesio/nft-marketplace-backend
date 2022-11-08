import { SalesModule } from '@app/common/sales/sales.module';
import { UsersModule } from '@app/common/users';
import { JwtConfig } from '@app/config/jwt';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MarketplaceModule } from 'apps/marketplace/src/marketplace/marketplace.module';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './controllers/auth-admin.controller';
import { MainAuthController } from './controllers/main-auth.controller';
import { TronHeadModule, TronHeadService } from '@app/common/tronhead';
import { BlockchainModule } from '@app/blockchain';
import { Web3ConnectorModule } from '@app/blockchain/connectors/web3-connector/web3-connector.module';
import { Web3AbiLoader } from '@app/blockchain/connectors/web3-connector/core';
import { join } from 'path';
import { BTTCContractsConfig } from '@app/config/bttc';
import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';

@Module({
  imports: [
    AuthModule,
    SalesModule,
    UsersModule,
    MarketplaceModule,
    JwtModule.register({
      secret: JwtConfig.JWT_SECRET,
    }),
    Web3ConnectorModule.forRoot(
      new Web3AbiLoader(join(process.cwd(), 'files', 'abi')),
      {url: BTTCContractsConfig.URL, connectionType: Web3ConnectionTypeEnum.HTTP},
    ),
    BlockchainModule,
    TronHeadModule
  ],
  controllers: [MainAuthController, AdminController],
})
export class MainAuthModule {}
