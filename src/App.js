import React, { useReducer } from "react";
import { useAutoSave } from "./hooks";

import { Garden } from "./components/garden";

const setPlantState = (state, payload) => {
  const { planterBoxIndex, plantIndex, plantState } = payload;

  state.planterBoxes[planterBoxIndex].plants[plantIndex] = plantState;

  return state;
};

const App = ({ initialState }) => {
  const [state, setState] = useReducer((state, { action, payload }) => {
    let newState = { ...state };
    if (action === "setPlantState") {
      return setPlantState(newState, payload);
    }
    if (action === "harvest") {
      newState = setPlantState(newState, payload);
      newState.plantMatter = newState.plantMatter + 1;
      return newState;
    }
  }, initialState);

  useAutoSave(state, 5000);

  return (
    <div>
      <div>plant matter: {state.plantMatter}</div>
      <Garden state={state} setState={setState} />
    </div>
  );
};
export { App };
