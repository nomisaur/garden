import { plantModels, soilModels } from './models';
import { initialPlantState } from './initialState';
import { clone } from './utils';
import { getPlanterState } from './state';

const plant = (state, { planterIndex, type, currentTime }) => {
  const {
    lifeStages: [{ growRate, drinkRate, dryRate }],
  } = plantModels[type];

  state.planters[planterIndex].soil = {
    ...state.planters[planterIndex].soil,
    timeStamp: currentTime,
    hasPlant: true,
    plant: {
      plantType: type,
      lifeStage: 0,
      hydration: 0,
      growTimeLeft: growRate,
      drinkTimeLeft: drinkRate,
      dryTimeLeft: dryRate,
    },
  };
  return state;
};

const soil = (state, { planterIndex, type, currentTime }) => {
  const { initialWaterLevel, evaporationRate } = soilModels[type];
  state.planters[planterIndex] = {
    ...state.planters[planterIndex],
    hasSoil: true,
    soil: {
      ...state.planters[planterIndex].soil,
      timeStamp: currentTime,
      soilType: type,
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

  state.plantMatter =
    state.plantMatter + plantModels[soil.plant.plantType].value;

  soil.hasPlant = false;
  soil.plant = {
    plant: initialPlantState,
  };

  return state;
};

export const shouldUpdate = (planterState, currentTime) => {
  const {
    timeStamp,
    hasSoil,
    hasPlant,
    waterLevel,
    evaporateTimeLeft,
    hydration,
    growTimeLeft,
    drinkTimeLeft,
    dryTimeLeft,
    fullyGrown,
    status,
  } = planterState;

  if (!hasSoil) {
    return {};
  }

  const totalTimePassed = currentTime - timeStamp;

  const evaporateTimerActive = waterLevel > 0;
  const drinkTimerActive = hasPlant && hydration < 100 && waterLevel > 0;
  const dryTimerActive = hasPlant && hydration > 0;
  const growTimerActive = hasPlant && !fullyGrown && status === 'healthy';

  const tickTime = Math.min(
    ...[
      [evaporateTimerActive, evaporateTimeLeft],
      [drinkTimerActive, drinkTimeLeft],
      [dryTimerActive, dryTimeLeft],
      [growTimerActive, growTimeLeft],
    ]
      .filter(([isActive, timeLeft]) => isActive && timeLeft)
      .map(([, timeLeft]) => timeLeft),
  );

  if (totalTimePassed < tickTime) {
    return {};
  }

  const shouldEvaporate =
    evaporateTimerActive && evaporateTimeLeft === tickTime;

  const shouldDrink = drinkTimerActive && drinkTimeLeft === tickTime;

  const shouldDry = dryTimerActive && dryTimeLeft === tickTime;

  const shouldGrow = growTimerActive && growTimeLeft === tickTime;

  const shouldDoUpdate =
    shouldEvaporate || shouldDrink || shouldDry || shouldGrow;

  return {
    shouldEvaporate,
    shouldDrink,
    shouldDry,
    shouldGrow,
    shouldDoUpdate,
    timePassed: tickTime,
  };
};

const getNewTimer = (timeLeft, oldTimer, newTimer) =>
  Math.round(newTimer * (timeLeft / oldTimer));

const update = (state, { planterIndex, currentTime }) => {
  const getNewPlanterState = (planterState) => {
    const fullPlanterState = getPlanterState(planterState);
    const {
      shouldEvaporate,
      shouldDrink,
      shouldDry,
      shouldGrow,
      shouldDoUpdate,
      timePassed,
    } = shouldUpdate(fullPlanterState, currentTime);

    if (!shouldDoUpdate) {
      return planterState;
    }

    const {
      timeStamp,
      waterLevel,
      evaporateTimeLeft,
      lifeStage,
      hydration,
      growTimeLeft,
      drinkTimeLeft,
      dryTimeLeft,
      drinkRate,
      dryRate,
      lifeStages,
      status,
      evaporationRate,
      fullyGrown,
    } = fullPlanterState;

    const newState = clone(planterState);

    newState.soil.timeStamp = timeStamp + timePassed;

    if (shouldGrow) {
      const newLifeStage = Math.min(lifeStage + 1, lifeStages.length - 1);

      const {
        growRate: newGrowRate,
        dryRate: newDryRate,
        drinkRate: newDrinkRate,
      } = lifeStages[newLifeStage];

      newState.soil.plant.lifeStage = newLifeStage;

      newState.soil.plant.growTimeLeft = newGrowRate;

      newState.soil.plant.dryTimeLeft = shouldDry
        ? newDryRate
        : getNewTimer(dryTimeLeft - timePassed, dryRate, newDryRate);

      newState.soil.plant.drinkTimeLeft = shouldDrink
        ? newDrinkRate
        : getNewTimer(drinkTimeLeft - timePassed, drinkRate, newDrinkRate);

      newState.soil.evaporateTimeLeft = shouldEvaporate
        ? evaporationRate
        : evaporateTimeLeft - timePassed;
    } else {
      if (status === 'healthy' && !fullyGrown) {
        newState.soil.plant.growTimeLeft = growTimeLeft - timePassed;
      }
      newState.soil.plant.drinkTimeLeft = drinkTimeLeft - timePassed;
      newState.soil.plant.dryTimeLeft = dryTimeLeft - timePassed;
      newState.soil.evaporateTimeLeft = evaporateTimeLeft - timePassed;
    }

    if (shouldDrink) {
      newState.soil.plant.hydration = Math.min(hydration + 1, 100);
      newState.soil.waterLevel = Math.max(waterLevel - 1, 0);
      if (!shouldGrow) {
        newState.soil.plant.drinkTimeLeft = drinkRate;
      }
    }

    if (shouldDry) {
      newState.soil.plant.hydration = Math.max(
        newState.soil.plant.hydration - 1,
        0,
      );
      if (!shouldGrow) {
        newState.soil.plant.dryTimeLeft = dryRate;
      }
    }

    if (shouldEvaporate) {
      newState.soil.waterLevel = Math.max(newState.soil.waterLevel - 1, 0);
      if (!shouldGrow) {
        newState.soil.evaporateTimeLeft = evaporationRate;
      }
    }
    return getNewPlanterState(newState);
  };

  const newPlanterState = getNewPlanterState(
    state.planters[planterIndex],
    state.planters[planterIndex],
  );

  state.planters[planterIndex].soil = {
    ...state.planters[planterIndex].soil,
    ...newPlanterState.soil,
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
