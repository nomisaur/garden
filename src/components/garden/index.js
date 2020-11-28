import React from "react";
import { PlanterBox } from "../planterBox";

const Garden = ({ state, setState }) => {
  return (
    <div>
      {state.planterBoxes.map((planterBoxState, index) => {
        return (
          planterBoxState.unlocked && (
            <PlanterBox
              key={index}
              planterBoxState={planterBoxState}
              setPlanterBoxState={({
                plantIndex,
                plantState,
                harvest = false,
              }) => {
                setState({
                  action: "setPlantState",
                  payload: {
                    planterBoxIndex: index,
                    plantIndex,
                    plantState,
                    harvest,
                  },
                });
              }}
            />
          )
        );
      })}
    </div>
  );
};

export { Garden };
