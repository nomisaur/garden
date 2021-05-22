import { gardenHandlers } from './gardenHandlers';

const forceState = (state, change) => {
  change(state);
  return state;
};

const screen = (state, screen) => {
  state.screen = screen;
  return state;
};

export const handlers = {
  forceState,
  screen,
  ...gardenHandlers,
};
