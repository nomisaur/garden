import React, { useReducer } from "react";
import { useAutoSave } from "./hooks";
import { handlers } from "./stateHandlers";
import { config } from "./config";
import { clone } from "./utils";

import { Garden } from "./components/garden";

const App = ({ initialState }) => {
  const [state, setState] = useReducer(
    (state, [action, payload]) => handlers[action](clone(state), payload),
    initialState
  );

  useAutoSave(state, config.autosave);

  if (config.isDev) {
    window.seeState = () => console.log(state);
  }

  return (
    <div>
      <div>plant matter: {state.plantMatter}</div>
      <Garden
        state={state}
        setState={(action, payload) => setState([action, payload])}
      />
    </div>
  );
};
export { App };
