import { plants } from './plants';
import { shouldUpdateLevels } from './utils/plantUtils';

const plant = (state, { planterBoxIndex, patchIndex, type }) => {
  const plant = plants[type];
  const firstPhase = plant.phases[0];
  const waterLevel = plant.initialWaterLevel;

  state.planterBoxes[planterBoxIndex].patches[patchIndex] = {
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

const updateLevels = (state, { planterBoxIndex, patchIndex, currentTime }) => {
  const patch = state.planterBoxes[planterBoxIndex].patches[patchIndex];
  const { type } = patch.plant;

  const plantData = plants[patch.plant.type];

  const getNewPlantState = (plantState, prevPlantState) => {
    const timePassed = currentTime - plantState.timeStamp;

    const prevStatus =
      plantData.phases[prevPlantState.phase].waterLevels[
        prevPlantState.waterLevel
      ].status;

    const { phaseBeep, waterBeep } = shouldUpdateLevels(
      plantState,
      currentTime,
    );

    const doPhaseChange = waterBeep
      ? phaseBeep && plantState.phaseTimeLeft < plantState.waterTimeLeft
      : phaseBeep;

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
    } else if (waterBeep) {
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

  const newPlantState = getNewPlantState(patch.plant, patch.plant);

  patch.plant = {
    ...patch.plant,
    ...newPlantState,
  };

  return state;
};

const harvest = (state, { planterBoxIndex, patchIndex }) => {
  const patch = state.planterBoxes[planterBoxIndex].patches[patchIndex];

  state.plantMatter = state.plantMatter + plants[patch.plant.type].value;

  patch.empty = true;
  patch.plant = {
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

const water = (state, { planterBoxIndex, patchIndex, currentTime }) => {
  const patch = state.planterBoxes[planterBoxIndex].patches[patchIndex];
  const current = patch.plant;

  const { waterLevels } = plants[current.type].phases[current.phase];

  const maxWaterLevel = waterLevels.length - 1;

  const waterLevel = Math.min(current.waterLevel + 1, maxWaterLevel);

  patch.plant = {
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
