import React, { useReducer } from "react";
import { useAutoSave, useFancyReducer } from "./hooks";
import { handlers } from "./stateHandlers";
import { config } from "./config";

import { Garden } from "./components/garden";

const App = ({ initialState }) => {
  const [state, setState] = useFancyReducer(handlers, initialState);

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
