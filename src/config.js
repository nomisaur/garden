import { time } from './utils/pureUtils';

export const config = {
  ...webpackConfig, // defined by webpack
  autosave: time({ seconds: 30 }),
};
