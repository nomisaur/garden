// webpackConfig is defined by webpack in ../webpack.config.js
export const { isDev } = webpackConfig;

// how often the plant game checks to update state
export const ticRate = 100;

// initial music settings
export const initialVolume = 0.1;
export const rootFrequency = 200;
export const noteGridSize = 12;
export const initialToggleMode = false;
export const initialLongRelease = true;
export const initialLowerMode = false;
