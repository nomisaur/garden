import { plants } from "./plants";

const grow = (state, { planterBoxIndex, patchIndex, startTime, phase }) => {
  state.planterBoxes[planterBoxIndex].patches[patchIndex].plant = {
    ...state.planterBoxes[planterBoxIndex].patches[patchIndex].plant,
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
  console.log({ patchIndex, planterBoxIndex });
  const type =
    state.planterBoxes[planterBoxIndex].patches[patchIndex].plant.type;
  console.log(type);

  state.plantMatter = state.plantMatter + plants[type].value;

  state.planterBoxes[planterBoxIndex].patches[patchIndex] = {
    empty: true,
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
