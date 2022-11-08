import { Web3ConnectionTypeEnum } from '@app/blockchain/enums';

export interface IWeb3ConnectionParams {
  readonly url: string;
  readonly connectionType: Web3ConnectionTypeEnum;
}
