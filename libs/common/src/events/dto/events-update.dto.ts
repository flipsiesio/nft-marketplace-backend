import { ApiProperty } from '@nestjs/swagger';
import { EventsEnum } from '../enums/cards-events.enum';

export class EventsUpdateDto {
  @ApiProperty()
  id?: number;

  @ApiProperty({ enum: EventsEnum })
  event?: EventsEnum;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  date?: Date;
}
