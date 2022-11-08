export type TronAbi = {
  entrys: Array<{
    outputs?: Array<{ type: string }>;
    constant?: Boolean;
    inputs?: Array<{ name?: string; type: string; indexed?: boolean }>;
    name?: string;
    stateMutability?: string;
    type?: string;
    payable?: boolean;
  }>;
};
