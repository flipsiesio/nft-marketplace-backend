import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventsEnum } from './enums/cards-events.enum';

@Entity({ name: 'events' })
export class EventsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  date: Date;

  @Column({
    name: 'event-type',
    type: 'enum',
    enum: EventsEnum,
    nullable: false,
  })
  eventType: EventsEnum;

  @Column()
  callerAddress: string;

  @Column()
  tokenId?: number;

  // Price column displays either the listing price,
  // the bid amount or the sale price for listed,
  // bid or sold events correspondingly;
  // for mint and de-list events the price is N/A
  @Column()
  price?: number;
}
