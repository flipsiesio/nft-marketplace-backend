import { TronHeadModule } from '@app/common/tronhead';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './entities/card.entity';
import { EventsBidEntity } from './entities/events-bid.entity';
import { EventsSaleEntity } from './entities/events-sale.entity';
import { MintEntity } from './entities/mint.entity';
import { SaleAndMintEntity } from './entities/sale-and-mint.entity';
import { StateBidEntity } from './entities/state-bid.entity';
import { StateSaleEntity } from './entities/state-sale.entity';
import { EventsService } from './events.service';
import { Web3ConnectorModule } from '@app/blockchain/connectors/web3-connector/web3-connector.module';
import { Web3AbiLoader } from '@app/blockchain/connectors/web3-connector/core';
import { join } from 'path';
import { BTTCContractsConfig } from '@app/config/bttc';
import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';
import { BlockchainModule } from '@app/blockchain';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventsBidEntity,
      StateBidEntity,
      EventsSaleEntity,
      StateSaleEntity,
      CardEntity,
      MintEntity,
      SaleAndMintEntity,
    ]),
    TronHeadModule,
    Web3ConnectorModule.forRoot(
      new Web3AbiLoader(join(process.cwd(), 'files', 'abi')),
      {url: BTTCContractsConfig.URL, connectionType: Web3ConnectionTypeEnum.HTTP},
    ),
    BlockchainModule,
    ScheduleModule.forRoot(),
  ],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
