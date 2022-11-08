import { Injectable } from '@nestjs/common';
import { TronService } from '../tron';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from 'apps/cards-cli/src/models/card';
import { Model } from 'mongoose';
import { BlockchainService } from '@app/blockchain';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from 'apps/marketplace/src/events/entities/card.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NftService {
  constructor(
    private tron: TronService,
    private readonly blockchainService: BlockchainService,
    @InjectModel(Card.name)
    private readonly cardRepository: Model<CardDocument>,
    @InjectRepository(CardEntity)
    private cardRepositoryTypeorm: Repository<CardEntity>,
  ) {}

  balanceOf(address: string) {
    return this.blockchainService.cardContract.isUserOwnNft(address);
  }

  getNftCard(tokenId: number) {
    return this.blockchainService.cardContract.getNftUri(tokenId);
  }

  // async getNftList(dto: NftsReqDto, address: string) {
  //   const filter: { id?: FindOperator<number> } & NftsReqDto['filter'] = {
  //     id: In([...nftIdList]),
  //   };
  //   if (dto?.filter?.face) filter.face = dto.filter.face;
  //   if (dto?.filter?.suit) filter.suit = dto.filter.suit;
  //   const nftList = await this.cardRepository.find({
  //     where: filter,
  //     skip: dto.skip || 0,
  //     take: dto.limit || 0,
  //   });
  //   return nftList;
  // }

  async getAddressCardsCount(address: string) {
    return (await this.blockchainService.cardContract.getNftIdList(address))
      .length;
  }

  async getAddressCardsList(
    address: string,
    //dto: NftsReqDto = { skip: 0, limit: 100 },
    //tokenIds: number[] = [],
  ): Promise<number[]> {
    // const cardsList = await this.blockchainService.cardContract.getNftIdList(
    //   address,
    // );
    // console.log('=====1===');
    // console.log(cardsList);
    // return cardsList;
    return (
      await this.cardRepositoryTypeorm
        .createQueryBuilder()
        .where({ ownerAddress: address })
        .getMany()
    ).map(stateCard => stateCard.cardId);

    // const nftIdList = (await this.tron.getNftIdList(address));/*.slice(
    //   dto.skip,
    //   dto.skip + dto.limit,
    // );*/

    // return nftIdList;
    //nftIdList.push(...tokenIds);
    //console.log(nftIdList);

    // const nftList = [];

    // for (let nftId of nftIdList) {
    //   const nft = await this.cardRepository.findOne(
    //     Object.assign(dto?.filter ? dto.filter : {}, { cardId: nftId }),
    //   );
    //   delete nft?.metadata?.content;
    //   nftList.push(nft);
    // }
    // console.log(nftList);
    //return nftList;
  }

  async mintRandomNft({
    receiverAddress,
    nftCount,
  }: {
    receiverAddress: string;
    nftCount: 1;
  }) {
    const mintResult = await this.blockchainService.mintNft(receiverAddress);

    // events history for all
    // TODO create events for all mints
    // this.eventsService.create({
    //   event: EventsEnum.Mint,
    //   callerAddress: receiverAddress,
    //   tokenId: 0,
    //   price: 0, //TODO its free for user?
    //   date: new Date(),
    // });
    return mintResult;
  }
}
