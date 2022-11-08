import { ContractsConfig } from '@app/config/contracts';
import { TronAbi } from './types/tronabi.type';

export const contractCardRandomMinterAddress =
  ContractsConfig.CONTRACT_RANDOM_MINTER;

export const contractCardRandomMinterAbi: TronAbi = {
  entrys: [
    {
      outputs: [{ type: 'uint8' }],
      constant: true,
      name: 'CARDS_WITH_TEARS_OPTION',
      stateMutability: 'View',
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
      payable: true,
      inputs: [{ name: '_itemsPerRandomMint', type: 'uint8' }],
      name: 'mintRandom',
      stateMutability: 'Payable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint8' }],
      constant: true,
      name: 'COLORIZED_OPTION',
      stateMutability: 'View',
      type: 'Function',
    },
    { name: 'getRevenue', stateMutability: 'Nonpayable', type: 'Function' },
    {
      inputs: [{ name: 'newFactoryAddress', type: 'address' }],
      name: 'setFactory',
      stateMutability: 'Nonpayable',
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
      outputs: [{ type: 'address' }],
      constant: true,
      name: 'owner',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_price', type: 'uint256' }],
      name: 'setPrice',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'bool' }],
      constant: true,
      inputs: [{ type: 'uint8' }],
      name: 'allowedItemsPerRandomMint',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      name: 'price',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'bool' }],
      constant: true,
      inputs: [{ type: 'address' }],
      name: 'isMinter',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_newSeed', type: 'int256' }],
      name: 'setCurrentSeed',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'address' }],
      constant: true,
      name: 'factory',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [
        { name: 'who', type: 'address' },
        { name: 'status', type: 'bool' },
      ],
      name: 'setMinter',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_amount', type: 'uint8' },
        { name: '_status', type: 'bool' },
      ],
      name: 'setAllowedAmountOfItemsPerRandomMint',
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
      inputs: [{ name: '_classProbs', type: 'uint16[5]' }],
      name: 'setProbabilitiesForClasses',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_itemsPerRandomMint', type: 'uint8' },
        { name: '_to', type: 'address' },
        { name: 'desc', type: 'string' },
      ],
      name: 'mintRandomFree',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      name: 'MAX_BPS',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_factory', type: 'address' }],
      stateMutability: 'Nonpayable',
      type: 'Constructor',
    },
    { payable: true, stateMutability: 'Payable', type: 'Fallback' },
    {
      inputs: [
        { name: '_amount', type: 'uint8' },
        { indexed: true, name: '_to', type: 'address' },
        { name: 'desc', type: 'string' },
      ],
      name: 'Minted',
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
