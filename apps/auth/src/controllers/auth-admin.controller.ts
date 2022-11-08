import { SalesService } from '@app/common/sales/sales.service';
import { UserRoleEnum, UsersService } from '@app/common/users';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  SetMetadata,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation, ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {  Roles } from '../decorators/role.decorator';
import { TronHeadService } from '@app/common/tronhead';
import { RolesGuard } from '../guards/roles.guard';
import { BlockchainService } from '@app/blockchain';

@ApiBearerAuth()
@Roles(UserRoleEnum.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(
    private usersService: UsersService,
    private salesService: SalesService,
    private tron: TronHeadService,
    private blockchainService: BlockchainService,
  ) { }

  @ApiOperation({ summary: 'Admin route' })
  @ApiOkResponse()
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('add-admin')
  addAdmin(@Body() body) {
    this.usersService.adminSetNewAdmin(
      body.adminExecutorAddress,
      body.adminToAddAddress,
    );
    return 'addAdmin';
  }

  @Post('remove-admin')
  removeAdmin(@Body() body) {
    this.usersService.adminRemoveAdmin(
      body.adminExecutorAddress,
      body.adminToAddAddress,
    );
    return 'removeAdmin';
  }

  @ApiQuery({
      name: 'startDate',
      type: String
  })
  @ApiQuery({
      name: 'endDate',
      type: String,
  })
  @Get('statistics-list')
  getStatistics(
      @Query('startDate') startDate,
      @Query('endDate') endDate,) {
    return this.salesService.getAll({
        startDate,
        endDate,
    });
  }

  @ApiQuery({
      name: 'startDate',
      type: String
  })
  @ApiQuery({
      name: 'endDate',
      type: String,
  })
  @Get('statistics-download')
  async  downloadStatistics(
    @Res() res,
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    const file = await this.salesService.downloadAll({
        startDate,
        endDate,
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('sale_nft.csv');

    return  res.send(file);
  }


  @Post('set-fee-receiver')
  setFeeReceiver(@Req() req, @Body() body: { address: string }) {
    return this.blockchainService.setFeeReceiver(body.address, req?.user?.tronWalletAddress);
  }

  @Post('withdraw-fee')
  withDrawFee(@Body() body) {
    return { status: 'method in progress', body };
    // TODO ask for info about the endpoint
    
    // return this.tron.contracts.marketplace????.withdrawFee(adminAddress);
    // this.usersService.adminWithDrawFee(body.adminReceiverAddress);
    // return 'withDrawFee';
  }

  @Post('set-global-selling-fee')
  setGlobalSellingFee(@Req() req, @Body() body: { fee: number }) {
    return this.blockchainService.setGlobalFee(body.fee, req?.user?.tronWalletAddress);
    // this.usersService.adminWithDrawFee(body.adminReceiverAddress);
    // return 'setGlobalSellingFee';
  }
}
