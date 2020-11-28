import React, { useReducer } from "react";
import { useAutoSave } from "./hooks";

import { Plant } from "./components/plant/plant";

const App = ({ initialState }) => {
  const [state, setState] = useReducer(
    (state, { action, index, value, time }) => {
      if (action === "setPhase") {
        const plants = state.plants;
        plants[index] = {
          phase: value,
          startTime: time,
        };
        return { ...state, plants };
      }
    },
    initialState
  );

  useAutoSave(state, 10000);

  return (
    <div>
      {state.plants.map(({ phase, startTime }, index) => {
        return (
          <Plant
            key={index}
            phase={phase}
            startTime={startTime}
            setPhase={(value, time) => {
              setState({ action: "setPhase", index, value, time });
            }}
          />
        );
      })}
    </div>
  );
};
export { App };
