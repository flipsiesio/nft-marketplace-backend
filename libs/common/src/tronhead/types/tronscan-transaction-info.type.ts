export type TronscanInternalTransaction = [
  {
    transaction_id: string;
    caller_address: string;
    note: string;
    rejected: boolean;
    value_info_list: string;
    date_created: number;
    contract: string;
    block: number;
    token_list: [
      {
        token_id: string;
        call_value: number;
        tokenInfo: {
          tokenId: string;
          tokenAbbr: string;
          tokenName: string;
          tokenDecimal: number;
          tokenCanShow: number;
          tokenType: string;
          tokenLogo: string;
          tokenLevel: string;
          vip: boolean;
        };
      },
    ];
    confirmed: boolean;
    hash: string;
    transfer_to_address: string;
  },
];

export type TronscanTransactionInfo = {
  block: number;
  hash: string;
  timestamp: number;
  ownerAddress: string;
  signature_addresses: [];
  contractType: number;
  toAddress: string;
  project: string;
  confirmations: number;
  confirmed: boolean;
  revert: boolean;
  contractRet: string;
  contractData: {
    data: string;
    owner_address: string;
    contract_address: string;
  };
  data: string;
  cost: {
    multi_sign_fee: number;
    net_fee: number;
    net_fee_cost: number;
    energy_usage: number;
    fee: number;
    energy_fee_cost: number;
    energy_fee: number;
    energy_usage_total: number;
    origin_energy_usage: number;
    net_usage: number;
  };
  trigger_info: {
    method: string;
    parameter: {
      [variable: string]: string;
    };
    contract_address: string;
    call_value: number;
  };
  internal_transactions: {
    [id: string]: TronscanInternalTransaction;
  };
  fee_limit: number;
  srConfirmList: [
    {
      address: string;
      name: string;
      block: number;
      url: string;
    },
  ];
  contract_type: string;
  event_count: number;
  transfersAllList: [];
  info: {};
  addressTag: {};
  contractInfo: {
    [key: string]: {
      tag1: string;
      tag1Url: string;
      name: string;
      vip: boolean;
    };
  };
  contract_map: {
    [address: string]: boolean;
  };
};
