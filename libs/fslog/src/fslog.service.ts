import { Injectable } from '@nestjs/common';

// import { writeFile } from 'fs';
// import { join } from 'path';

@Injectable()
export class FslogService {
  //   fslog(...message: string[]) {
  //     writeFile(
  //       join(__dirname, '/logs/', String(new Date())) + '.json',
  //       JSON.stringify(message),
  //       () => {
  //       });
  //   }
}
