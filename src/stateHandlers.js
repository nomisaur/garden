import { plantModels } from './models';
import { shouldUpdateLevels } from './models/plantUtils';

const plant = (state, { soilIndex, type }) => {
  const {
    lifeStages: [firstPhase],
  } = plantModels[type];

  state.soils[soilIndex] = {
    ...state.soils[soilIndex],
    empty: false,
    plant: {
      timeStamp: Date.now(),
      type,
      lifeStage: 0,
      lifeStageTimeLeft: firstPhase.duration,
      waterLevel: 0,
      waterTimeLeft: firstPhase.drinkrate,
    },
  };
  return state;
};

/* const getNewWaterTimeLeft = (
  newPhase,
  { phase, waterTimeLeft, waterLevel },
  plantModel,
  timePassed,
) => {
  const newDuration =
    plantModel.phases[newPhase].waterLevels[waterLevel].duration;

  const { duration } = plantModel.phases[phase].waterLevels[waterLevel];
  const timeLeft = waterTimeLeft - timePassed;

  return Math.round(newDuration * (timeLeft / duration));
}; */

const update = (state, { soilIndex, currentTime }) => {
  const getNewSoilState = (soilState, prevSoilState) => {
    const timePassed = currentTime - soilState.timeStamp;
  };

  const newSoilState = getNewSoilState(
    state.soils[soilIndex],
    state.soils[soilIndex],
  );

  state.soils[soilIndex] = {
    ...state.soils[soilIndex],
    ...newSoilState,
  };

  return state;
};

/* const updateLevels = (state, { soilIndex, currentTime }) => {
  const soil = state.soils[soilIndex];
  const { type } = soil.plant;
  const plantModel = plantModels[type];

  const getNewPlantState = (plantState, prevPlantState) => {
    const timePassed = currentTime - plantState.timeStamp;

    const prevStatus =
      plantModel.phases[prevPlantState.phase].waterLevels[
        prevPlantState.waterLevel
      ].status;

    const { shouldUpdatePhase, shouldUpdateWater } = shouldUpdateLevels(
      plantState,
      currentTime,
    );

    const doPhaseChange = shouldUpdateWater
      ? shouldUpdatePhase && plantState.phaseTimeLeft < plantState.waterTimeLeft
      : shouldUpdatePhase;

    if (doPhaseChange) {
      const timeStamp = plantState.timeStamp + plantState.phaseTimeLeft;
      const phase = Math.min(
        plantState.phase + 1,
        plantModel.phases.length - 1,
      );
      const phaseTimeLeft = plantModel.phases[phase].duration;
      const waterTimeLeft = getNewWaterTimeLeft(
        phase,
        plantState,
        plantModel,
        timePassed,
      );

      return getNewPlantState(
        {
          type,
          timeStamp,
          phase,
          phaseTimeLeft,
          waterLevel: plantState.waterLevel,
          waterTimeLeft,
        },
        plantState,
      );
    } else if (shouldUpdateWater) {
      const timeStamp = plantState.timeStamp + plantState.waterTimeLeft;
      const { phase } = plantState;

      const waterLevel = Math.max(0, plantState.waterLevel - 1);
      const waterTimeLeft =
        plantModel.phases[phase].waterLevels[waterLevel].duration;
      const phaseTimeLeft =
        prevStatus === 'healthy'
          ? plantState.phaseTimeLeft - plantState.waterTimeLeft
          : plantState.phaseTimeLeft;

      return getNewPlantState(
        {
          type,
          timeStamp,
          phase,
          phaseTimeLeft,
          waterLevel,
          waterTimeLeft,
        },
        plantState,
      );
    } else {
      return plantState;
    }
  };

  const newPlantState = getNewPlantState(soil.plant, soil.plant);

  soil.plant = {
    ...soil.plant,
    ...newPlantState,
  };

  return state;
}; */

const harvest = (state, { soilIndex }) => {
  const soil = state.soils[soilIndex];

  state.plantMatter = state.plantMatter + plantModels[soil.plant.type].value;

  soil.empty = true;
  soil.plant = {
    plant: {
      timeStamp: null,
      type: null,
      phase: null,
      phaseTimeLeft: null,
      waterLevel: null,
      waterTimeLeft: null,
    },
  };

  return state;
};

const water = (state, { soilIndex, currentTime }) => {
  const soilState = state.soils[soilIndex];

  state.soils[soilIndex] = {
    ...soilState,
    timeStamp: currentTime,
    waterLevel: Math.min(soilState.waterLevel + 10, 100),
  };
  return state;
};

export const handlers = {
  plant,
  update,
  harvest,
  water,
};
