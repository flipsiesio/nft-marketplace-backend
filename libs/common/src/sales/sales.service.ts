import { Between, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './sales.entity';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';
import { Parser } from 'json2csv';

//TODO refactor
@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private salesRepository: Repository<Sale>,
  ) {}

  async getAll({ startDate, endDate }) {
    try {
      return await this.salesRepository.find({
        where: { createdAt: Between(startDate, endDate) },
      }); //.toISOString()
    } catch (error) {
      console.log(error);
    }
  }

  async downloadAll({ startDate, endDate }) {
    try {
      const tableDb = await this.salesRepository.find({
        where: { createdAt: Between(startDate, endDate) },
      }); //.toISOString()

      const parser = new Parser({
          fields:  [
              'id',
              'createdAt',
              'saleDate',
              'tokenAddress',
              'sellerAddress',
              'buyerAddress',
              'salePrice',
              'platformFeeAmountPaid',
              'transactionHash'
          ]
      });

      return await parser.parse(tableDb);
    } catch (error) {
      console.log(error);
    }
  }

  //TODO add findSaleDto and check work
  async findByFilter(
    findSaleDto: UpdateSaleDto,
    order?: string,
    limit?: number,
    offset?: number,
  ) {
    try {
      const filter: {
        order?;
        offset?;
        limit?;
        where?;
      } = {};

      if (order) filter.order = order;
      if (offset) filter.offset = order;
      if (limit) filter.limit = order;
      if (order) {
        filter.where = findSaleDto;
        Object.keys(findSaleDto).forEach(
          param => (filter.where[param] = findSaleDto[param]),
        );
      }
      return await this.salesRepository.find(filter);
    } catch (error) {
      console.log(error);
    }
  }

  async findOneById(id: number) {
    try {
      return await this.salesRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  }

  async findOneByTokenAddress(tokenAddress: string) {
    try {
      return await this.salesRepository.findOne({ where: { tokenAddress } });
    } catch (error) {
      console.log(error);
    }
  }

  async findOneBySellerAddress(sellerAddress: string) {
    try {
      return await this.salesRepository.findOne({ where: { sellerAddress } });
    } catch (error) {
      console.log(error);
    }
  }

  async findOneByBuyerAddress(buyerAddress: string) {
    try {
      return await this.salesRepository.findOne({ where: { buyerAddress } });
    } catch (error) {
      console.log(error);
    }
  }

  async create(createSaleDto: CreateSaleDto) {
    try {
      return await this.salesRepository.insert(createSaleDto);
    } catch (error) {
      console.log(error);
    }
  }

  async update(updateSaleDto: UpdateSaleDto) {
    try {
      return await this.salesRepository.update(
        { id: updateSaleDto.id },
        updateSaleDto,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.salesRepository.delete(id);
    } catch (error) {
      console.log(error);
    }
  }
}
