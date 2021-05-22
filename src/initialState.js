import { list } from './utils';

export const initialPlantState = {
  plantType: null,
  lifeStage: null,
  hydration: null,
  growTimeLeft: null,
  drinkTimeLeft: null,
  dryTimeLeft: null,
};

export const initialSoilState = {
  timeStamp: null,
  soilType: null,
  hasPlant: false,
  waterLevel: null,
  evaporateTimeLeft: null,
  plant: initialPlantState,
};

export const initialState = {
  plantMatter: 0,
  screen: 'garden',
  planters: list(4, (n) => ({
    hasSoil: false,
    soil: initialSoilState,
  })),
};
