import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { MarketplaceService } from '../../../marketplace/src/marketplace/marketplace.service';
import { UserRoleEnum } from './../../../../libs/common/src/users/users-roles.enum';

@Injectable()
export class NftCountGuard extends AuthGuard('nft') {
  constructor(
    private jwtService: JwtService,
    private marketplaceService: MarketplaceService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = (<string>request.headers.authorization)?.split(' ')[1];
    const userData = await this.jwtService.decode(token);

    if (userData['roles'].includes(UserRoleEnum.Admin)) {
      return true;
    }

    //     const cards = await this.marketplaceService.getCardByOwnerAddress(userData['tronWalletAddress']);

    //    if(!cards){
    //        throw new UnauthorizedException('This user does not  has nft');
    //    }
    return true;
  }
}
