import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'nest-logger';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { JwtConfig } from '@app/config/jwt';
import { UserRoleEnum, UsersService } from '@app/common/users';
import { AuthJwtTypesEnum } from '../enums/auth-jwt-types.enum';
import { AuthCheckSignDto } from '../dto/auth-check-sign.dto';
import { TronHeadService } from '@app/common/tronhead';
import { MarketplaceService } from 'apps/marketplace/src/marketplace/marketplace.service';
import { InWalletListedEnum } from '../enums/inWalletListed.enum';
import { WEB3_PROVIDER } from '@app/blockchain/constants';
import Web3 from 'web3';
import { BTTCContractsConfig } from '@app/config/bttc';
import { BlockchainService } from '@app/blockchain';

@Injectable()
export class AuthService {
  private redisCheckString = 'redisCheckString';
  private redisBlockJwt = 'redisBlockJwt';

  constructor(
    @InjectRedis() private readonly redisService: Redis,
    private logger: LoggerService,
    private jwtService: JwtService,
    private marketplaceService: MarketplaceService,
    private userService: UsersService,
    private tron: TronHeadService,
    @Inject(WEB3_PROVIDER) private web3: Web3,
    private blockchainService: BlockchainService,
  ) {
    this.initAdmin();
  }

  async initAdmin() {
    const admin = await this.userService.findAdmin();

    if (admin) {
      return true;
    }
    const owner =
      await this.blockchainService.marketplaceContract.getAdminAddress();
    await this.userService.create({
      tronWalletAddress: owner,
      role: UserRoleEnum.Admin,
    });
  }

  /*
   * Проверяем пользовательский JWT
   * tronWalletAddress должен совпадать с адресом из базы данных
   * в req.user попадает поле user.roles, которое мы позже проверяем в гарде "RolesGuard"
   * в req.user попадает поле user.tronWalletAddress, которое служит для проверки
   * */
  async validateUser(tronWalletAddress: string, tokenType: string) {
    const userFromDb = await this.userService.findOneByAddress(
      tronWalletAddress,
    );
    if (
      userFromDb &&
      userFromDb.tronWalletAddress === tronWalletAddress &&
      tokenType === 'accessToken'
    ) {
      return {
        tronWalletAddress: userFromDb.tronWalletAddress,
        tokenType,
        role: userFromDb.role,
      };
    }
    return null;
  }

  /*
   * У пользователя должно быть от 1 карты и более для доступа в магазин
   * Гард NFT проверяет наличие подобных карт
   */
  async validateUserByNftCount(tronWalletAddress: string): Promise<boolean> {
    try {
      /* method 1 - by db - dependent by DB */
      const userCards: number[] =
        await this.marketplaceService.getTokensByAddress({
          take: InWalletListedEnum.All,
          address: tronWalletAddress,
        });
      if (userCards.length === 0) return false;
      return true;
      /* method 2 - by blockchain - slower */
      // return await this.tron.contracts.card.userHaveNft(tronWalletAddress);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /*
   * Фронт автоматически отправлят запрос на signIn
   * На Бэке создается проверочная строка, сохраняется в redis
   * Проверочная строка отправляется на фронт
   * */
  async signIn(walletAddress: string) {
    console.log('signIn', walletAddress);
    const randomCheckString = Math.floor(Math.random() * 100000);
    const hash = await this.web3.eth.accounts.sign(
      randomCheckString.toString(),
      BTTCContractsConfig.BTTC_PRIVATE_KEY,
    );
    console.log({ hash });

    try {
      const resultOfSaving = await this.redisService.set(
        walletAddress + this.redisCheckString,
        randomCheckString,
        'EX',
        JwtConfig.JWT_ACCESS_EXPIRE,
      );
      if (resultOfSaving !== 'OK') throw new InternalServerErrorException();
      return randomCheckString;
    } catch (error) {
      console.log(error);
    }
  }

  /*
   * Фронт, после получения проверочной строки, подписывает ее (sign) приватным ключом
   * Подписанная проверочная строка проверяется при помощи публичного ключа юзера
   * Если подпись действительна, то проверяется существует ли юзер, если нет то создается новый
   * Пользователю выдается пара JWT, из бд redis удаляется проверочная строка
   * В Redis записывается refreshToken по ключу tronWalletAddress
   * Если подпись ложна, то мы выкидываем исключение
   * */
  async checkSign(authCheckSignDto: AuthCheckSignDto) {
    console.log('checkSign', authCheckSignDto);

    try {
      const redisStrToVerify = await this.redisService.get(
        authCheckSignDto.walletAddress + this.redisCheckString,
      );
      console.log('redisStrToVerify', redisStrToVerify);

      const address = await this.web3.eth.accounts.recover(
        redisStrToVerify,
        authCheckSignDto.signature,
      );
      const messageIsVerified =
        address.toLowerCase() === authCheckSignDto.walletAddress.toLowerCase()
          ? true
          : false;

      if (messageIsVerified) {
        // const isDelCheck = await this.redisService.del(
        //   authCheckSignDto.tronWalletAddress + this.redisCheckString,
        // );
        // const isDelBlock = await this.redisService.del(
        //   authCheckSignDto.tronWalletAddress + this.redisBlockJwt,
        // );
        const userFromDb = await this.userService.findOneByAddress(
          authCheckSignDto.walletAddress,
        );

        console.log('userFromDb', userFromDb);

        if (userFromDb) {
          return await this.createJwtPair(authCheckSignDto.walletAddress);
        } else {
          await this.userService.create({
            tronWalletAddress: authCheckSignDto.walletAddress,
          });
          return await this.createJwtPair(authCheckSignDto.walletAddress);
        }
      }

      return new UnauthorizedException('Tron Wallet Sign not valid');
    } catch (error) {
      console.log('Tron Wallet Sign check error', error);
      return new InternalServerErrorException({
        message: 'Tron Wallet Sign check error',
        error,
      });
    }
  }

  private async createJwtPair(tronWalletAddress: string) {
    const userFromDb = await this.userService.findOneByAddress(
      tronWalletAddress,
    );
    const accessToken = this.jwtService.sign(
      {
        tronWalletAddress: tronWalletAddress,
        tokenType: AuthJwtTypesEnum.AccessToken,
        // check: randomJwtString,
        roles: [userFromDb.role],
      },
      {
        expiresIn: JwtConfig.JWT_ACCESS_EXPIRE,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        tronWalletAddress: tronWalletAddress,
        tokenType: AuthJwtTypesEnum.RefreshToken,
        // check: randomJwtString,
        roles: userFromDb.role,
      },
      {
        expiresIn: JwtConfig.JWT_REFRESH_EXPIRE,
      },
    );

    // await this.redisService.del([tronWalletAddress + this.redisBlockJwt]);

    await this.redisService.hset(
      'accessToken: ' + tronWalletAddress,
      accessToken,
      accessToken,
      'EX',
      JwtConfig.JWT_ACCESS_EXPIRE,
    );
    await this.redisService.hset(
      'refreshToken: ' + tronWalletAddress,
      accessToken,
      refreshToken,
      'EX',
      JwtConfig.JWT_ACCESS_EXPIRE,
    );

    await this.redisService.expire(
      'accessToken: ' + tronWalletAddress,
      JwtConfig.JWT_ACCESS_EXPIRE,
    );
    await this.redisService.expire(
      'refreshToken: ' + tronWalletAddress,
      JwtConfig.JWT_ACCESS_EXPIRE,
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  //TODO check another ways to logout by Redis, TODO add access-token check
  async refresh({
    accessToken,
    refreshToken,
    tronWalletAddress,
  }: {
    accessToken: string;
    refreshToken: string;
    tronWalletAddress: string;
  }) {
    if (!refreshToken)
      throw new UnauthorizedException('auth tokens is missing');
    if (
      !this.jwtService.verify(refreshToken, { secret: JwtConfig.JWT_SECRET })
    ) {
      throw new UnauthorizedException('invalid refresh token');
    }

    if (!(await this.checkRefresh({ tronWalletAddress, accessToken }))) {
      throw new UnauthorizedException('invalid refresh token');
    }

    let refreshTokenDecoded;
    try {
      refreshTokenDecoded = this.jwtService.decode(refreshToken);
      console.log('/refresh deconde', refreshTokenDecoded, tronWalletAddress);
      if (
        !refreshTokenDecoded ||
        refreshTokenDecoded.tronWalletAddress !== tronWalletAddress
      ) {
        return new UnauthorizedException('It not the user token');
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Cant find user');
    }
    return this.createJwtPair(refreshTokenDecoded.tronWalletAddress);
  }

  async signOut(
    // выйти из аккаунта
    tronWalletAddress: string,
    accessToken: string /*tronWalletAddress: string*/,
  ) {
    try {
      // let resultOfBlock = await this.redisService.set(
      //   tronWalletAddress + this.redisBlockJwt,
      //   tronWalletAddress,
      //   'EX',
      //   JwtConfig.JWT_ACCESS_EXPIRE,
      // );

      const resultOfBlock = await this.redisService.hdel(
        'accessToken: ' + tronWalletAddress,
        accessToken,
      );

      await this.redisService.hdel(
        'refreshToken: ' + tronWalletAddress,
        accessToken,
      );

      if (!!resultOfBlock) return true;
      return false;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Cant find user');
    }
  }

  async signOutAll(tronWalletAddress: string) {
    try {
      const resultOfBlock = await this.redisService.del(
        'accessToken: ' + tronWalletAddress,
      );

      await this.redisService.del('refreshToken: ' + tronWalletAddress);

      if (!!resultOfBlock) return true;
      return false;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Cant find user');
    }
  }

  async checkBlock({ tronWalletAddress }: { tronWalletAddress: string }) {
    // проверяет заблокирован ли tronWallet
    try {
      let isBlocked = await this.redisService.get(
        tronWalletAddress + this.redisBlockJwt,
      );

      console.log('isBlocked', isBlocked);
      if (!!isBlocked == false) return false;
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Wallet address check error',
      );
    }
  }

  async checkToken({
    // проверяет заблокирован ли accessToken
    tronWalletAddress,
    accessToken,
  }: {
    tronWalletAddress: string;
    accessToken: string;
  }) {
    try {
      const isBlocked = !(await this.redisService.hget(
        'accessToken: ' + tronWalletAddress,
        accessToken,
      ));
      console.log('isBlocked', isBlocked);
      if (!!isBlocked == false) return false;
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Wallet address check error',
      );
    }
  }

  async checkRefresh({
    // обновляет время действия accessToken
    tronWalletAddress,
    accessToken,
  }: {
    tronWalletAddress: string;
    accessToken: string;
  }) {
    try {
      const isBlocked = !(await this.redisService.hget(
        'accessRefresh: ' + tronWalletAddress,
        accessToken,
      ));
      console.log('isBlocked', isBlocked);
      if (!!isBlocked == false) return false;
      return true;
    } catch (error) {
      return true;
      throw new InternalServerErrorException(
        error,
        'Wallet address check error',
      );
    }
  }
}
