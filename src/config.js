import { time } from './utils/pureUtils';

export const config = {
  ...webpackConfig,
  autosave: time({ seconds: 1 }),
};
