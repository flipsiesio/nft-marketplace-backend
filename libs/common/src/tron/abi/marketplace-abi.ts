import { ContractsConfig } from '@app/config/contracts';
import { TronAbi } from './types/tronabi.type';

export const contractMarketplaceAddress =
  ContractsConfig.CONTRACT_NFT_MARKETPLACE;

export const contractMarketplaceAbi: TronAbi = {
  entrys: [
    {
      inputs: [{ name: '_newNFTOnSale', type: 'address' }],
      name: 'setWorkingNFT',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      name: 'maxExpirationDuration',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      name: 'getSellOrdersAmount',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      payable: true,
      inputs: [
        { name: '_at', type: 'uint256' },
        { name: '_amount', type: 'uint256' },
      ],
      name: 'bid',
      stateMutability: 'Payable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [{ name: '_at', type: 'uint256' }],
      name: 'getSellOrderStatus',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_fee', type: 'uint256' }],
      name: 'setFee',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      name: 'renounceOwnership',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [{ name: '_at', type: 'uint256' }],
      name: 'getSellOrderPrice',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'address' }],
      constant: true,
      name: 'nftOnSale',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_at', type: 'uint256' },
        { name: '_price', type: 'uint256' },
      ],
      name: 'setPriceFor',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'address' }],
      constant: true,
      name: 'owner',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [{ name: '_at', type: 'uint256' }],
      name: 'getSellOrderFeesPaid',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [{ name: '_at', type: 'uint256' }],
      name: 'getSellOrderExpirationTime',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      name: 'minExpirationDuration',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_at', type: 'uint256' }],
      name: 'cancelBid',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      name: 'feeInBps',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_at', type: 'uint256' },
        { name: '_expirationTime', type: 'uint256' },
      ],
      name: 'setExpirationTimeFor',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [{ name: '_at', type: 'uint256' }],
      name: 'getBackFromSale',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'address' }],
      constant: true,
      name: 'feeReceiver',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      name: 'MAX_FEE',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'address' }],
      constant: true,
      inputs: [{ name: '_at', type: 'uint256' }],
      name: 'getSellOrderSeller',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_maxExpirationDuration', type: 'uint256' }],
      name: 'setMaxExpirationDuration',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [{ name: '_at', type: 'uint256' }],
      name: 'getSellOrderTokenId',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_minExpirationDuration', type: 'uint256' }],
      name: 'setMinExpirationDuration',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [
        { name: 'buyer', type: 'address' },
        { name: '_at', type: 'uint256' },
      ],
      name: 'performBuyOperation',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [{ name: '_feeReceiver', type: 'address' }],
      name: 'setFeeReceiver',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'bytes4' }],
      inputs: [{ type: 'address' }, { type: 'uint256' }, { type: 'bytes' }],
      name: 'onERC721Received',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [{ name: '_newOwner', type: 'address' }],
      name: 'transferOwnership',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_nftToSell', type: 'uint256' },
        { name: '_price', type: 'uint256' },
        { name: '_expirationDuration', type: 'uint256' },
      ],
      name: 'acceptTokenToSell',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_nftOnSale', type: 'address' },
        { name: '_feeReceiver', type: 'address' },
        { name: '_minExpirationDuration', type: 'uint256' },
        { name: '_maxExpirationDuration', type: 'uint256' },
        { name: '_feeInBps', type: 'uint256' },
      ],
      stateMutability: 'Nonpayable',
      type: 'Constructor',
    },
    { payable: true, stateMutability: 'Payable', type: 'Fallback' },
    {
      inputs: [
        { indexed: true, name: 'tokenId', type: 'uint256' },
        { indexed: true, name: 'orderIndex', type: 'uint256' },
        { name: 'seller', type: 'address' },
        { name: 'expirationTime', type: 'uint256' },
      ],
      name: 'OrderCreated',
      type: 'Event',
    },
    {
      inputs: [
        { indexed: true, name: 'orderIndex', type: 'uint256' },
        { indexed: true, name: 'buyer', type: 'address' },
        { name: 'price', type: 'uint256' },
      ],
      name: 'OrderFilled',
      type: 'Event',
    },
    {
      inputs: [{ indexed: true, name: 'orderIndex', type: 'uint256' }],
      name: 'OrderRejected',
      type: 'Event',
    },
    {
      inputs: [
        { indexed: true, name: 'orderIndex', type: 'uint256' },
        { indexed: true, name: 'buyer', type: 'address' },
        { name: 'added', type: 'uint256' },
        { indexed: true, name: 'total', type: 'uint256' },
      ],
      name: 'Bid',
      type: 'Event',
    },
    {
      inputs: [
        { indexed: true, name: 'orderIndex', type: 'uint256' },
        { indexed: true, name: 'buyer', type: 'address' },
        { indexed: true, name: 'amount', type: 'uint256' },
      ],
      name: 'BidCancelled',
      type: 'Event',
    },
    {
      inputs: [{ indexed: true, name: 'previousOwner', type: 'address' }],
      name: 'OwnershipRenounced',
      type: 'Event',
    },
    {
      inputs: [
        { indexed: true, name: 'previousOwner', type: 'address' },
        { indexed: true, name: 'newOwner', type: 'address' },
      ],
      name: 'OwnershipTransferred',
      type: 'Event',
    },
  ],
};
