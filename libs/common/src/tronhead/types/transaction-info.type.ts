export type TransactionInfo = {
  id: string;
  fee: number;
  blockNumber: number;
  blockTimeStamp: number;
  contractResult: Array<string>;
  contract_address: string;
  receipt: {
    energy_fee: number;
    energy_usage_total: number;
    net_fee: number;
    result: string;
  };
  log: Array<{
    address: string;
    topics: Array<string>;
    data: string;
  }>;
  internal_transactions: Array<{
    hash: string;
    caller_address: string;
    transferTo_address: string;
    callValueInfo: Array<any>;
    note: string;
  }>;
  packingFee: number;
};
