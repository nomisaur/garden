import React, { useReducer } from "react";
import { useAutoSave } from "./hooks";
import { setPlantState } from "./stateHandlers";
import { config } from "./config";

import { Garden } from "./components/garden";

const App = ({ initialState }) => {
  const [state, setState] = useReducer((state, { action, payload }) => {
    let newState = { ...state };
    if (action === "setPlantState") {
      return setPlantState(newState, payload);
    }
  }, initialState);

  useAutoSave(state, config.autosave);

  if (config.isDev) {
    window.seeState = () => console.log(state);
  }

  return (
    <div>
      <div>plant matter: {state.plantMatter}</div>
      <Garden state={state} setState={setState} />
    </div>
  );
};
export { App };