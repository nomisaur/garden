import { plantForms } from './plants';
import { shouldUpdateLevels } from './plants/plantUtils';

const plant = (state, { soilIndex, type }) => {
  const plant = plantForms[type];
  const firstPhase = plant.phases[0];
  const waterLevel = plant.initialWaterLevel;

  state.soils[soilIndex] = {
    empty: false,
    plant: {
      timeStamp: Date.now(),
      type,
      phase: 0,
      phaseTimeLeft: firstPhase.duration,
      waterLevel,
      waterTimeLeft: firstPhase.waterLevels[waterLevel].duration,
    },
  };
  return state;
};

const getNewWaterTimeLeft = (
  newPhase,
  { phase, waterTimeLeft, waterLevel },
  plantData,
  timePassed,
) => {
  const newDuration =
    plantData.phases[newPhase].waterLevels[waterLevel].duration;

  const { duration } = plantData.phases[phase].waterLevels[waterLevel];
  const timeLeft = waterTimeLeft - timePassed;

  return Math.round(newDuration * (timeLeft / duration));
};

const updateLevels = (state, { soilIndex, currentTime }) => {
  const soil = state.soils[soilIndex];
  const { type } = soil.plant;

  const plantData = plantForms[soil.plant.type];

  const getNewPlantState = (plantState, prevPlantState) => {
    const timePassed = currentTime - plantState.timeStamp;

    const prevStatus =
      plantData.phases[prevPlantState.phase].waterLevels[
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
      const phase = Math.min(plantState.phase + 1, plantData.phases.length - 1);
      const phaseTimeLeft = plantData.phases[phase].duration;
      const waterTimeLeft = getNewWaterTimeLeft(
        phase,
        plantState,
        plantData,
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
        plantData.phases[phase].waterLevels[waterLevel].duration;
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
};

const harvest = (state, { soilIndex }) => {
  const soil = state.soils[soilIndex];

  state.plantMatter = state.plantMatter + plantForms[soil.plant.type].value;

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
  const soil = state.soils[soilIndex];
  const current = soil.plant;

  const { waterLevels } = plantForms[current.type].phases[current.phase];

  const maxWaterLevel = waterLevels.length - 1;

  const waterLevel = Math.min(current.waterLevel + 1, maxWaterLevel);

  soil.plant = {
    ...current,
    waterLevel,
    timeStamp: currentTime,
  };
  return state;
};

export const handlers = {
  plant,
  updateLevels,
  harvest,
  water,
};
