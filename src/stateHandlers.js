const setPlantState = (state, payload) => {
  const { planterBoxIndex, plantIndex, plantState, harvest } = payload;

  state.planterBoxes[planterBoxIndex].plants[plantIndex] = plantState;

  if (harvest) {
    state.plantMatter = state.plantMatter + 1;
  }

  return state;
};

export { setPlantState };
