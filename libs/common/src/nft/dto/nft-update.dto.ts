import { PartialType } from '@nestjs/swagger';
import { CreateNftsDto } from './nft-create.dto';

export class UpdateNftDto extends PartialType(CreateNftsDto) {}
