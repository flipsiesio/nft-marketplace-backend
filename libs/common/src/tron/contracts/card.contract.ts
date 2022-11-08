import { WalletConfig } from '@app/config/wallet';
import { InternalServerErrorException } from '@nestjs/common';
import { contractCardAbi, contractCardAddress } from '../abi';
import { TronContract } from './contract';

export class ContractCard extends TronContract {
  address = contractCardAddress;
  abi = contractCardAbi;

  // async create(): Promise<ContractCard> {
  //   return super.create();
  // }

  async getNftIdList(address: string) {
    try {
      let idList = await this.contract.getNFTListByAddress(address).call();
      return idList.map(idBigNumber => idBigNumber.toNumber());
    } catch (error) {
      console.log('getNftIdList -> error', error);
      throw new InternalServerErrorException(error, 'getOwnerNftList -> error');
    }
  }

  async getNftUri(tokenId: number) {
    try {
      const tokenUri = await this.contract.tokenURI(tokenId).call();
      return tokenUri;
    } catch (error) {
      console.log('getNftUri -> error', error);
    }
  }

  async mintNft(receiverAddress: string, description: string = '') {
    // const result = await this.cardRandomMinterContract.mintRandomFree(count, address).send(); //TODO then use this method
    const tokenId = Math.round((Math.random() * 10) ^ 6); // TODO get random from DB uint256;
    try {
      const result = await this.contract
        .mint(receiverAddress, tokenId, description)
        .send();
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('cant mint', error);
    }
  }

  async setMinterRole() {
    try {
      const result = await this.contract
        .setMinterRole(WalletConfig.ADDRESS, true)
        .send();
      console.log('setMinterRole: ', result);
      return result;
    } catch (error) {
      console.log('setMinterRole -> error', error);
      throw new InternalServerErrorException(error, 'setMinterRole -> error');
    }
  }

  async isUserOwnNft(address: string): Promise<boolean> {
    try {
      const result = await this.contract.balanceOf(address);
      return !!result;
    } catch (error) {
      console.log('balanceOf -> error', error);
      throw new InternalServerErrorException(error, 'balanceOf -> error');
    }
  }

  async userHaveNft(userAddress: string) {
    try {
      let list: number[] = await this.contract
        .getNFTListByAddress(userAddress)
        .call();
      if (list.length === 0) return false;
      return true;
    } catch (error) {
      console.log('userHaveNft -> error', error);
      throw new InternalServerErrorException(error, 'userHaveNft -> error');
    }
  }

  // Количество заминченных карт
  async totalSupply(): Promise<number> {
    return Number(await this.contract.totalSupply().call());
  }

  // Существует ли карта
  async tokenExists(tokenId: number): Promise<Boolean> {
    return this.contract.exists(tokenId).call();
  }

  // Получить карту по индексу
  async tokenByIndex(index: number): Promise<number> {
    return Number(await this.contract.tokenByIndex(index).call());
  }
}
