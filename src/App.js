import React, { useReducer } from "react";
import { useAutoSave } from "./hooks";

import { Garden } from "./components/garden";

const App = ({ initialState }) => {
  const [state, setState] = useReducer((state, { action, payload }) => {
    let newState = { ...state };
    if (action === "setPlantState") {
      const { planterBoxIndex, plantIndex, plantState, harvest } = payload;

      newState.planterBoxes[planterBoxIndex].plants[plantIndex] = plantState;

      if (harvest) {
        newState.plantMatter = newState.plantMatter + 1;
      }

      return newState;
    }
  }, initialState);

  window.seeState = () => console.log(state);

  useAutoSave(state, 1500);

  return (
    <div>
      <div>plant matter: {state.plantMatter}</div>
      <Garden state={state} setState={setState} />
    </div>
  );
};
export { App };
