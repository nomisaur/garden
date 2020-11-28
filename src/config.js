import { time, getQueryParams } from "./utils";

const queryParams = getQueryParams();

export const config = {
  autosave: time({ seconds: 3 }),
  isDev: Boolean(queryParams.dev),
};
