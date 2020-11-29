import { plants } from './plants';

const grow = (state, { planterBoxIndex, patchIndex, startTime, phase }) => {
  const patch = state.planterBoxes[planterBoxIndex].patches[patchIndex];
  patch.plant = {
    ...patch.plant,
    phase,
    startTime,
  };

  return state;
};

const plant = (state, { planterBoxIndex, patchIndex, type }) => {
  state.planterBoxes[planterBoxIndex].patches[patchIndex] = {
    empty: false,
    plant: {
      type,
      phase: 0,
      startTime: Date.now(),
    },
  };
  return state;
};

const harvest = (state, { planterBoxIndex, patchIndex }) => {
  const patch = state.planterBoxes[planterBoxIndex].patches[patchIndex];

  state.plantMatter = state.plantMatter + plants[patch.plant.type].value;

  patch.empty = true;
  patch.plant = {
    plant: {
      type: null,
      phase: null,
      startTime: null,
    },
  };

  return state;
};

export const handlers = {
  grow,
  plant,
  harvest,
};
