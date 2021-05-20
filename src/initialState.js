const initialPlantState = {
  timeStamp: null,
  type: null,
  phase: null,
  phaseTimeLeft: null,
  waterLevel: null,
  waterTimeLeft: null,
};

const initialSoilState = {
  empty: true,
  soilWaterLevel: null,
  plant: initialPlantState,
};

export const initialState = {
  plantMatter: 0,
  soils: [initialSoilState, initialSoilState, initialSoilState],
};
