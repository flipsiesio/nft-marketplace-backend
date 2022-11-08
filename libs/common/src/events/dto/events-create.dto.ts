import { ApiProperty } from '@nestjs/swagger';
import { EventsEnum } from '../enums/cards-events.enum';

export class EventsCreateDto {
  @ApiProperty({ enum: EventsEnum })
  event: EventsEnum;

  @ApiProperty()
  callerAddress: string;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  date: Date;
}
