import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class NftCountStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(tronWalletAddress: string): Promise<boolean> {
    const isValid = await this.authService.validateUserByNftCount(
      tronWalletAddress,
    );
    if (!isValid) {
      throw new UnauthorizedException(
        'Not enough NFT cards count. Must be 1 or more.',
      );
    }
    return isValid;
  }
}
