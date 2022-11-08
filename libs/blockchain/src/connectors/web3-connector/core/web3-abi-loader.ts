import { readdir, readFile } from 'fs/promises';
import { resolve, join } from 'path';
import { AbiItem } from 'web3-utils';
import { IWeb3AbiLoader } from '../interfaces';

export class Web3AbiLoader implements IWeb3AbiLoader {
  constructor(private directory: string) {}

  /**
   * File name format for loader
   * @example '<name>.<network>.<contract-address>.json'
   */
  async getAbi(contractAddress: string): Promise<AbiItem | AbiItem[]> {
    const abiFiles = await readdir(resolve(this.directory));

    console.log("======")
    console.log(this.directory)
    console.log(contractAddress)
    const abiFileName = abiFiles.find((file) => {
      const testAddress = file.split('.')[0];
      return testAddress === contractAddress;
    });

    if (!abiFileName) {
      throw new Error(`ABI file not found ${contractAddress}`);
    }

    const pathToFile = resolve(join(this.directory, abiFileName));
    const fileData = await readFile(pathToFile, 'utf-8');

    return JSON.parse(fileData);
  }
}
