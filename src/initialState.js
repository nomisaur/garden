const initialPlantState = {
  timeStamp: null,
  type: null,
  lifeStage: null,
  waterLevel: null,
  phaseTimeLeft: null,
  waterTimeLeft: null,
};

const initialSoilState = {
  timeStamp: null,
  type: 'starter',
  empty: true,
  waterLevel: 0,
  plant: initialPlantState,
  waterTimeLeft: null,
};

export const initialState = {
  plantMatter: 0,
  soils: [initialSoilState, initialSoilState, initialSoilState],
};
