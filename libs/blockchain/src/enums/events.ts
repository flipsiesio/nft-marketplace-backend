export enum CardContractEvents {
  ALL_EVENTS = 'allEvents',
  TRANSFER = 'Transfer',
}

export enum MarketplaceContractEvents {
  ALL_EVENTS = 'allEvents',
  OrderCreated = 'OrderCreated',
  OrderRejected = 'OrderRejected',
  OrderFilled = 'OrderFilled',
  Bid = 'Bid',
  BidCancelled = 'BidCancelled',
}

export enum NftSaleContractEvents {
  ALL_EVENTS = 'allEvents',
  OrderCreated= 'OrderCreated',
  OrderFilled ='OrderFilled',
  OrderRejected = 'OrderRejected',
  OwnershipTransferred = 'OwnershipTransferred'
}
