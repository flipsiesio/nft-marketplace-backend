import { ContractsConfig } from '@app/config/contracts';
import { TronAbi } from './types/tronabi.type';

export const contractCardFactoryAddress = ContractsConfig.CONTRACT_CARD_FACTORY;

export const contractCardFactoryAbi: TronAbi = {
  entrys: [
    {
      outputs: [{ type: 'bool' }],
      constant: true,
      inputs: [{ type: 'address' }],
      name: 'isOptionMinter',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint8' }],
      constant: true,
      name: 'CARDS_WITH_TEARS_OPTION',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_mintableToken', type: 'address' }],
      name: 'setMintableToken',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint8' }],
      constant: true,
      name: 'CARDS_WITH_EGGS_OPTION',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint8' }],
      constant: true,
      name: 'COLORIZED_OPTION',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [{ name: 'optionId', type: 'uint8' }],
      name: 'availableTokens',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      name: 'renounceOwnership',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint8' }],
      constant: true,
      name: 'RARE_OPTION',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint8' }],
      constant: true,
      name: 'JOKERS_OPTION',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'bool' }],
      inputs: [
        { name: 'optionId', type: 'uint8' },
        { name: 'toAddress', type: 'address' },
      ],
      name: 'mint',
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
      outputs: [{ type: 'address' }],
      constant: true,
      name: 'mintableToken',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [
        { name: 'optionId', type: 'uint8' },
        { name: 'startId', type: 'uint256' },
        { name: 'endId', type: 'uint256' },
      ],
      name: 'setIdBoundaryForOption',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_minter', type: 'address' },
        { name: '_status', type: 'bool' },
      ],
      name: 'setMinterRole',
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
      inputs: [{ name: '_mintableToken', type: 'address' }],
      stateMutability: 'Nonpayable',
      type: 'Constructor',
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
