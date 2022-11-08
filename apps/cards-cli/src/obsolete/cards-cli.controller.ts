// import { Controller, Get, Post } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { CardsCliService } from './cards-cli.service';

// @ApiTags('api')
// @Controller('api/cards-cli')
// export class CardsCliController {
//   constructor(private readonly cardsCliService: CardsCliService) {}

//   @Post('generate')
//   generate() {
//     return this.cardsCliService.generate({ cardsCount: 5, eggIsOn: true, teardropIsOn: true });
//   }

//   @Post('check')
//   check() {
//     return this.cardsCliService.check();
//   }

//   @Get('cards')
//   getCards() {
//     return this.cardsCliService.getCards();
//   }
// }
