import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthDto } from '../dto/auth.dto';
import { AuthCheckSignDto } from '../dto/auth-check-sign.dto';
import { MarketplaceService } from 'apps/marketplace/src/marketplace/marketplace.service';
import { Auth } from '../decorators/auth.decorator';
import { AuthCheckRefreshDto } from '../dto/auth-check-refresh.dto';
import { InWalletListedEnum } from '../enums/inWalletListed.enum';

@ApiTags('auth')
@Controller('api/auth')
export class MainAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly marketplaceService: MarketplaceService,
  ) {}

  @ApiOperation({ summary: 'Log into service' })
  @ApiOkResponse()
  @ApiInternalServerErrorResponse({
    description: 'Sign-in internal server error',
  })
  @ApiBody({ type: AuthDto })
  @Post('sign-in')
  async signIn(
    @Body('tronWalletAddress') tronWalletAddress: string,
  ): Promise<number> {
    let userCards;
    try {
      userCards = await this.marketplaceService.getTokensByAddress({
        take: InWalletListedEnum.All,
        address: tronWalletAddress,
      });
    } catch (e) {
      throw new BadRequestException('Invalid address provided');
    }
    if (!userCards.length) {
      throw new ForbiddenException("You don't have cards");
    }
    return this.authService.signIn(tronWalletAddress);
  }

  @ApiInternalServerErrorResponse({
    description: 'Check-sign internal server error',
  })
  @ApiOperation({ summary: 'Verify signed message' })
  @ApiBody({ type: AuthCheckSignDto })
  @Post('check-sign')
  checkSign(@Body() authCheckSignDto: AuthCheckSignDto) {
    return this.authService.checkSign(authCheckSignDto);
  }

  @ApiOperation({ summary: 'Log out of service' })
  @ApiInternalServerErrorResponse({
    description: 'Sign-out internal server error',
  })
  @ApiBody({ type: AuthDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  signOut(
    @Body('tronWalletAddress') tronWalletAddress: string,
    @Body('accessToken') accessToken: string,
  ): Promise<boolean> {
    return this.authService.signOut(tronWalletAddress, accessToken);
  }

  @Auth()
  @Post('sign-out-all')
  signOutAll(@Req() req) {
    return this.authService.signOutAll(req?.user?.tronWalletAddress);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiInternalServerErrorResponse({
    description: 'Get user profile internal server error',
  })
  @Auth()
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Refresh session' })
  @ApiInternalServerErrorResponse({
    description: 'Refresh JWT-token internal server error',
  })
  // @Auth()
  @ApiBody({ type: AuthCheckRefreshDto })
  @Post('refresh')
  refresh(
    @Req() req,
    @Body('accessToken') accessToken: string,
    @Body('refreshToken') refreshToken: string,
    @Body('tronWalletAddress') tronWalletAddress: string,
  ) {
    console.log(req.user);
    return this.authService.refresh({
      accessToken: accessToken,
      refreshToken: refreshToken,
      tronWalletAddress: tronWalletAddress,
    });
  }
}
