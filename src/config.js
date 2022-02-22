// webpackConfig is defined by webpack in ../webpack.config.js
export const { isDev } = webpackConfig;

// how often the plant game checks to update state
export const ticRate = 100;

// initial music settings
export const initialVolume = 0.5;
export const rootFrequency = 187; // works nice with refresh rate
export const noteGridSize = 14;
export const initialToggleMode = false;
export const initialLongRelease = true;
export const initialLowerMode = false;
