import * as dotenv from 'dotenv';

let setupIsComplete = false;

export const setupDotEnv = () => {
  if (!setupIsComplete) {
    setupIsComplete = true;

    const path =
      !process.env.NODE_ENV || process.env.NODE_ENV == 'production'
        ? './.env'
        : `./.env.${process.env.NODE_ENV}`;

    dotenv.config({ path });
  }
};
