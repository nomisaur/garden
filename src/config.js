import { time } from './utils';

export const config = {
   ...webpackConfig, // defined by webpack
   autosave: time({ minutes: 5 }),
};
