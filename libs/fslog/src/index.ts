export * from './fslog.module';
export * from './fslog.service';

import { writeFileSync } from 'fs';
import { join } from 'path';

export function fslog(...message: string[] | object[]) {
  const name =
    new Date().toLocaleDateString() +
    ' ' +
    new Date().toLocaleTimeString().replaceAll(':', '.');
  writeFileSync(
    join(__dirname, '/logs/', name) + '.json',
    JSON.stringify(message),
  );
}
