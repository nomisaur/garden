const initialPlantState = {
  type: null,
  lifeStage: null,
  waterLevel: null,
  lifeTimeLeft: null,
  waterTimeLeft: null,
};

const initialSoilState = {
  timeStamp: null,
  type: 'starter',
  empty: true,
  waterLevel: 50,
  plant: initialPlantState,
  waterTimeLeft: null,
};

export const initialState = {
  plantMatter: 0,
  soils: [initialSoilState, initialSoilState, initialSoilState],
};
