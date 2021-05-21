import { list } from './utils';

export const initialPlantState = {
  type: null,
  lifeStage: null,
  hydration: null,
  growTimeLeft: null,
  drinkTimeLeft: null,
  dryTimeLeft: null,
};

export const initialSoilState = {
  timeStamp: null,
  type: null,
  hasPlant: false,
  waterLevel: null,
  evaporateTimeLeft: null,
  plant: initialPlantState,
};

export const initialState = {
  plantMatter: 0,
  planters: list(4, (n) => ({
    hasSoil: false,
    soil: initialSoilState,
  })),
};
