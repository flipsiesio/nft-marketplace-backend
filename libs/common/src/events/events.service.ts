import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsEntity } from './events.entity';
import { EventsUpdateDto } from './dto/events-update.dto';
import { EventsCreateDto } from './dto/events-create.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsEntity)
    private eventsRepository: Repository<EventsEntity>,
  ) {}

  async findAll() {
    try {
      return await this.eventsRepository.find();
    } catch (error) {
      console.log(error);
    }
  }

  //TODO add findEventDto and check work
  async findByFilter({
    findSaleDto,
    order,
    limit,
    offset,
  }: {
    findSaleDto: EventsUpdateDto;
    order?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const filter: {
        order?;
        offset?;
        limit?;
        where?;
        status?;
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
      return await this.eventsRepository.find(filter);
    } catch (error) {
      console.log(error);
    }
  }

  async findOneById(id: number) {
    try {
      return await this.eventsRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  }

  async findOneByTokenAddress(tokenAddress: string) {
    try {
      return await this.eventsRepository.findOne({
        where: { callerAddress: tokenAddress },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async create(eventsCreateDto: EventsCreateDto) {
    try {
      return await this.eventsRepository.insert(eventsCreateDto);
    } catch (error) {
      console.log(error);
    }
  }

  async update(eventsUpdateDto: EventsUpdateDto) {
    try {
      return await this.eventsRepository.update(
        { id: eventsUpdateDto.id },
        eventsUpdateDto,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.eventsRepository.delete(id);
    } catch (error) {
      console.log(error);
    }
  }
}
