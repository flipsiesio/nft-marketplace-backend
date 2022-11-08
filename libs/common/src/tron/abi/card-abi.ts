import { ContractsConfig } from '@app/config/contracts';
import { TronAbi } from './types/tronabi.type';

export const contractCardAddress = ContractsConfig.CONTRACT_CARD;

export const contractCardAbi: TronAbi = {
  entrys: [
    {
      outputs: [{ type: 'bool' }],
      constant: true,
      inputs: [{ name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'string' }],
      constant: true,
      name: 'name',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'address' }],
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'getApproved',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' },
      ],
      name: 'approve',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256[]' }],
      constant: true,
      inputs: [{ name: '_nftOwner', type: 'address' }],
      name: 'getNFTListByAddress',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      name: 'totalSupply',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' },
      ],
      name: 'transferFrom',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [
        { name: '_owner', type: 'address' },
        { name: '_index', type: 'uint256' },
      ],
      name: 'tokenOfOwnerByIndex',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' },
      ],
      name: 'mint',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' },
      ],
      name: 'safeTransferFrom',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'bool' }],
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'exists',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [{ name: '_index', type: 'uint256' }],
      name: 'tokenByIndex',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'address' }],
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'ownerOf',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      outputs: [{ type: 'uint256' }],
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      name: 'renounceOwnership',
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
      outputs: [{ type: 'string' }],
      constant: true,
      name: 'symbol',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_approved', type: 'bool' },
      ],
      name: 'setApprovalForAll',
      stateMutability: 'Nonpayable',
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
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' },
        { name: '_data', type: 'bytes' },
      ],
      name: 'safeTransferFrom',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    {
      outputs: [{ type: 'string' }],
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'tokenURI',
      stateMutability: 'View',
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
      outputs: [{ type: 'bool' }],
      constant: true,
      inputs: [
        { name: '_owner', type: 'address' },
        { name: '_operator', type: 'address' },
      ],
      name: 'isApprovedForAll',
      stateMutability: 'View',
      type: 'Function',
    },
    {
      inputs: [{ name: '_newOwner', type: 'address' }],
      name: 'transferOwnership',
      stateMutability: 'Nonpayable',
      type: 'Function',
    },
    { stateMutability: 'Nonpayable', type: 'Constructor' },
    {
      inputs: [
        { indexed: true, name: '_from', type: 'address' },
        { indexed: true, name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'Event',
    },
    {
      inputs: [
        { indexed: true, name: '_owner', type: 'address' },
        { indexed: true, name: '_approved', type: 'address' },
        { name: '_tokenId', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'Event',
    },
    {
      inputs: [
        { indexed: true, name: '_owner', type: 'address' },
        { indexed: true, name: '_operator', type: 'address' },
        { name: '_approved', type: 'bool' },
      ],
      name: 'ApprovalForAll',
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
