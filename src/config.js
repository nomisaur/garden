import { time } from "./utils";

export const config = {
  ...webpackConfig,
  autosave: time({ seconds: 3 }),
};
