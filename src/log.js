import { config } from './config';

const log = (...args) => {
   if (config.isDev) {
      console.log(...args);
   }
};

export { log };
