import { Injectable, Logger } from '@nestjs/common';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { AddResult } from 'ipfs-core-types/src/root';
import { ImportCandidate } from 'ipfs-core-types/src/utils';

@Injectable()
export class IpfsService {
  private readonly client: IPFSHTTPClient;
  private readonly logger = new Logger(IpfsService.name);

  constructor() {
    // TODO: Pass configuration
    this.client = this.newClient();
  }

  newClient() {
    return create({ url: 'https://ipfs.infura.io:5001/api/v0' });
  }

  async addFile(file: ImportCandidate): Promise<AddResult> {
    return this.client.add(file);
  }

  async getFile(path: string): Promise<AsyncIterable<Uint8Array>> {
    const file = await this.client.get(path);
    return file;
  }
}
