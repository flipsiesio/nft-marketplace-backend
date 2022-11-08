import {
  applyDecorators,
  Controller,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/src/decorators/auth.decorator';
import { JackpotGetIssuedDto } from './dtos/jackpoDtos.dto';
import { JackpotService } from './jackpot.service';

@ApiTags('jackpot')
@Controller('api/jackpot')
export class JackpotController {
  constructor(private readonly jackpotService: JackpotService) {}

  @Auth()
  @Get('issued')
  @applyDecorators(
    ApiOperation({ summary: 'Получение информации о джекпотах' }),
    ApiQuery({ name: 'skip', type: Number, required: false }),
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({
      name: 'viewed',
      type: Boolean,
      required: false,
      description:
        'Отметка о том, просмотрен ли джекпот (если не указано, то все)',
    }),
    ApiQuery({
      name: 'issued',
      type: Boolean,
      required: false,
      description:
        'Отметка о том, был ли джекпот выдан (если не указано, то все)',
    }),
    ApiQuery({
      name: 'requestId',
      type: String,
      required: false,
      description: 'Идентификатор игры',
    }),
    ApiResponse({
      schema: {
        example: {
          count: 0,
          jackpots: {
            requestId: 'gameId',
            createdAt: new Date(123125125),
            updatedAt: new Date(123125125),
            userAddress: 'TGmuXaUee2DGBnUd14dPgTFUv1mZzfmbnP',
            status: 0,
            viewed: false,
            tokenId: 71,
            mintTimestamp: 124121251,
            amount: 1,
          },
        },
      },
    }),
  )
  async getIssued(
    @Query() dto: JackpotGetIssuedDto,
    @Req() req: Request & { user: { tronWalletAddress: string } },
  ) {
    return this.jackpotService.getIssued(req.user.tronWalletAddress, dto);
  }

  @Auth()
  @Post('setViewed')
  @applyDecorators(
    ApiOperation({ summary: 'Поставить отметку просмотренно' }),
    ApiQuery({
      name: 'requestId',
      type: String,
      required: true,
      description: 'Идентификатор игры',
    }),
    ApiResponse({
      schema: {
        example: {
          previousViewed: false,
        },
      },
    }),
  )
  async setViewed(@Query('requestId') requestId: string) {
    return this.jackpotService.postSetViewed(requestId);
  }

  @Auth()
  @applyDecorators(
    ApiOperation({
      summary: 'Тестовый endpoint - обязательно перед выпуском удалить',
    }),
    ApiQuery({
      name: 'requestId',
      type: String,
      required: true,
      description: 'Идентификатор игры',
    }),
    ApiQuery({
      name: 'userAddress',
      type: String,
      required: true,
      description: 'Адрес пользователя',
    }),
  )
  @Post('new-jackpot')
  async newJackpot(
    @Query('reqestId') reqestId: string,
    @Query('userAddress') userAddress: string,
  ) {
    return this.jackpotService.newJackpot(reqestId, userAddress);
  }
}
