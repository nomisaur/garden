import React, { useReducer } from "react";
import { useAutoSave } from "./hooks";

import { Garden } from "./components/garden";

const App = ({ initialState }) => {
  const [state, setState] = useReducer((state, { action, payload }) => {
    const newState = { ...state };
    if (action === "setPlantState") {
      const { planterBoxIndex, plantIndex, plantState } = payload;

      newState.planterBoxes[planterBoxIndex].plants[plantIndex] = plantState;

      return newState;
    }
  }, initialState);

  useAutoSave(state, 5000);

  return (
    <div>
      <Garden state={state} setState={setState} />
    </div>
  );
};
export { App };
