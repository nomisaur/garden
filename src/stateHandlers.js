import { plantModels, soilModels } from './models';
import { initialPlantState } from './initialState';
import { clone } from './utils';

const plant = (state, { planterIndex, type }) => {
  const {
    lifeStages: [{ ageRate, drinkRate, dryRate }],
  } = plantModels[type];

  state.planters[planterIndex].soil = {
    ...state.planters[planterIndex].soil,
    timeStamp: Date.now(),
    hasPlant: true,
    plant: {
      type,
      lifeStage: 0,
      hydration: 0,
      growTimeLeft: ageRate,
      drinkTimeLeft: drinkRate,
      dryTimeLeft: dryRate,
    },
  };
  return state;
};

const soil = (state, { planterIndex, type }) => {
  const { initialWaterLevel, evaporationRate } = soilModels[type];
  state.planters[planterIndex] = {
    ...state.planters[planterIndex],
    hasSoil: true,
    soil: {
      ...state.planters[planterIndex].soil,
      timeStamp: Date.now(),
      type,
      hasPlant: false,
      waterLevel: initialWaterLevel,
      evaporateTimeLeft: evaporationRate,
    },
  };
  return state;
};

const water = (state, { planterIndex }) => {
  const soilState = state.planters[planterIndex].soil;

  state.planters[planterIndex].soil = {
    ...soilState,
    waterLevel: Math.min(soilState.waterLevel + 10, 100),
  };
  return state;
};

const harvest = (state, { planterIndex }) => {
  const soil = state.planters[planterIndex].soil;

  state.plantMatter = state.plantMatter + plantModels[soil.plant.type].value;

  soil.hasPlant = false;
  soil.plant = {
    plant: initialPlantState,
  };

  return state;
};

export const shouldUpdate = (soilState, currentTime) => {
  const {
    timeStamp,
    waterLevel,
    evaporateTimeLeft,
    hasPlant,
    plant: {
      type: plantType,
      lifeStage,
      hydration,
      growTimeLeft,
      drinkTimeLeft,
      dryTimeLeft,
    },
  } = soilState;
  const plantModel = hasPlant ? plantModels[plantType] : {};
  const { healthyMin, healthyMax } = hasPlant
    ? plantModel.lifeStages[lifeStage]
    : {};

  const timePassed = currentTime - timeStamp;

  const shouldEvaporate = evaporateTimeLeft < timePassed && waterLevel > 0;
  const shouldDrink =
    hasPlant && drinkTimeLeft < timePassed && hydration < 100 && waterLevel > 0;
  const shouldDry = hasPlant && dryTimeLeft < timePassed && hydration > 0;
  const shouldGrow =
    hasPlant &&
    growTimeLeft < timePassed &&
    lifeStage < plantModel.lifeStages.length - 1 &&
    hydration >= healthyMin &&
    hydration <= healthyMax;

  const shouldDoUpdate =
    shouldEvaporate || shouldDrink || shouldDry || shouldGrow;

  return {
    shouldEvaporate,
    shouldDrink,
    shouldDry,
    shouldGrow,
    shouldDoUpdate,
  };
};

const update = (state, { planterIndex, currentTime }) => {
  const getNewSoilState = (soilState, prevSoilState) => {
    const {
      shouldEvaporate,
      shouldDrink,
      shouldDry,
      shouldGrow,
      shouldDoUpdate,
    } = shouldUpdate(soilState, currentTime);

    if (!shouldDoUpdate) {
      return soilState;
    }

    const newState = { soil: clone(soilState) };

    if (shouldGrow) {
      const { lifeStage, type } = newState.soil.plant;
      const { lifeStages } = plantModels[type];
      const newLifeStage = Math.min(lifeStage + 1, lifeStages.length - 1);
      newState.soil.plant.lifeStage = newLifeStage;
    }

    if (shouldDry) {
      newState.soil.plant.hydration = Math.max(
        newState.soil.plant.hydration - 1,
        0,
      );
    }

    if (shouldDrink) {
      newState.soil.plant.hydration = Math.min(
        newState.soil.plant.hydration + 1,
        100,
      );
      newState.soil.waterLevel = Math.max(newState.soil.waterLevel - 1, 0);
    }

    if (shouldEvaporate) {
      newState.soil.waterLevel = Math.max(newState.soil.waterLevel - 1, 0);
    }

    const timePassed = currentTime - newState.soil.timeStamp;
    newState.soil.timeStamp = newState.soil.timeStamp + timePassed;

    const {
      evaporateTimeLeft,
      type: soilType,
      hasPlant,
      plant: {
        type: plantType,
        lifeStage,
        drinkTimeLeft,
        dryTimeLeft,
        growTimeLeft,
      },
    } = newState.soil;

    newState.soil.evaporateTimeLeft =
      evaporateTimeLeft - timePassed <= 0
        ? soilModels[soilType].evaporationRate
        : evaporateTimeLeft - timePassed;

    if (hasPlant) {
      const { drinkRate, dryRate, ageRate } = plantModels[plantType].lifeStages[
        lifeStage
      ];

      newState.soil.plant.drinkTimeLeft =
        drinkTimeLeft - timePassed <= 0
          ? drinkRate
          : drinkTimeLeft - timePassed;

      newState.soil.plant.dryTimeLeft =
        dryTimeLeft - timePassed <= 0 ? dryRate : dryTimeLeft - timePassed;

      const prevHydration = prevSoilState.plant.hydration;
      const { healthyMax, healthyMin } = plantModels[
        prevSoilState.plant.type
      ].lifeStages[prevSoilState.plant.lifeStage];

      if (prevHydration >= healthyMin && prevHydration <= healthyMax) {
        newState.soil.plant.growTimeLeft =
          growTimeLeft - timePassed <= 0 ? ageRate : growTimeLeft - timePassed;
      }
    }

    return getNewSoilState(newState.soil, soilState);
  };

  const newSoilState = getNewSoilState(
    state.planters[planterIndex].soil,
    state.planters[planterIndex].soil,
  );

  state.planters[planterIndex].soil = {
    ...state.planters[planterIndex].soil,
    ...newSoilState,
  };

  return state;
};

const forceState = (state, change) => {
  change(state);
  return state;
};

export const handlers = {
  plant,
  soil,
  update,
  harvest,
  water,
  forceState,
};
