import { clone, includeIf } from '../../utils';
import { getPlanterState, getItemState } from '../../state';
import { initialPlantState } from '../../initialState';
import { plantModels, soilModels } from '../../models';

export const plant = (state, { planterIndex, type, currentTime }) => {
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

/* export const plant = (state, { planterIndex, type, currentTime }) => {
  const planterState = state.getPlanter(planterIndex);
  const newPlant = createPlant(type);

  planterState.setTimeStamp(currentTime);
  planterState.setHasPlant(true);
  planterState.setPlant(newPlant);

  return state.state();
}; */

export const soil = (state, { planterIndex, type, currentTime }) => {
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

export const water = (state, { planterIndex, currentTime }) => {
  const soilState = state.planters[planterIndex].soil;
  state.planters[planterIndex].soil = {
    ...soilState,
    timeStamp: currentTime,
    waterLevel: Math.min(soilState.waterLevel + 10, 100),
    evaporateTimeLeft: soilModels[soilState.soilType].evaporationRate,
  };
  return state;
};

export const harvest = (state, { planterIndex }) => {
  const { drops } = getPlanterState(state.planters[planterIndex]);

  drops.forEach(({ item, amount, max }) => {
    console.log(item);
    const invItem = state.inventory.find(({ item: invItem }) => {
      console.log(invItem, item);
      return invItem === item;
    });
    if (!invItem) {
      state.inventory.push({ item, amount: Math.min(amount, max) });
    } else {
      const { amount: invAmount } = getItemState(invItem);
      invItem.amount = Math.min(invAmount + amount, max);
    }
  });

  const soil = state.planters[planterIndex].soil;
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
    isHealthy,
    drainValue,
  } = planterState;

  if (!hasSoil) {
    return {};
  }

  const totalTimePassed = currentTime - timeStamp;

  const evaporateTimerActive = waterLevel > 0;
  const drinkTimerActive =
    hasPlant && hydration < 100 && waterLevel >= drainValue;
  const dryTimerActive = hasPlant && hydration > 0 && waterLevel === 0;
  const growTimerActive = hasPlant && !fullyGrown && isHealthy;

  const tickTime = Math.min(
    ...[
      ...includeIf(evaporateTimeLeft, evaporateTimerActive),
      ...includeIf(drinkTimeLeft, drinkTimerActive),
      ...includeIf(dryTimeLeft, dryTimerActive),
      ...includeIf(growTimeLeft, growTimerActive),
    ],
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
    evaporateTimerActive,
    drinkTimerActive,
    dryTimerActive,
    growTimerActive,
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

const getNewPlanterState = (planterState, currentTime) => {
  const fullPlanterState = getPlanterState(planterState);
  const {
    evaporateTimerActive,
    drinkTimerActive,
    dryTimerActive,
    growTimerActive,
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
    evaporationRate,
    drinkValue,
    drainValue,
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
      : getNewTimer(
          dryTimerActive ? dryTimeLeft - timePassed : dryTimeLeft,
          dryRate,
          newDryRate,
        );

    newState.soil.plant.drinkTimeLeft = shouldDrink
      ? newDrinkRate
      : getNewTimer(
          drinkTimerActive ? drinkTimeLeft - timePassed : dryTimeLeft,
          drinkRate,
          newDrinkRate,
        );

    newState.soil.evaporateTimeLeft = shouldEvaporate
      ? evaporationRate
      : evaporateTimerActive
      ? evaporateTimeLeft - timePassed
      : evaporateTimeLeft;
  } else {
    if (growTimerActive) {
      newState.soil.plant.growTimeLeft = growTimeLeft - timePassed;
    }
    if (drinkTimerActive) {
      newState.soil.plant.drinkTimeLeft = shouldDrink
        ? drinkRate
        : drinkTimeLeft - timePassed;
    }
    if (dryTimerActive) {
      newState.soil.plant.dryTimeLeft = shouldDry
        ? dryRate
        : dryTimeLeft - timePassed;
    }
    if (evaporateTimerActive) {
      newState.soil.evaporateTimeLeft = shouldEvaporate
        ? evaporationRate
        : evaporateTimeLeft - timePassed;
    }
  }

  if (shouldDrink) {
    newState.soil.plant.hydration = Math.min(hydration + drinkValue, 100);
    newState.soil.waterLevel = Math.max(waterLevel - drainValue, 0);
  }

  if (shouldDry) {
    newState.soil.plant.hydration = Math.max(
      newState.soil.plant.hydration - 1,
      0,
    );
  }

  if (shouldEvaporate) {
    newState.soil.waterLevel = Math.max(newState.soil.waterLevel - 1, 0);
  }

  return getNewPlanterState(newState, currentTime);
};

export const update = (state, { planterIndex, currentTime }) => {
  const newPlanterState = getNewPlanterState(
    state.planters[planterIndex],
    currentTime,
  );

  state.planters[planterIndex].soil = {
    ...state.planters[planterIndex].soil,
    ...newPlanterState.soil,
  };

  return state;
};
update.shouldNotSave = true;
