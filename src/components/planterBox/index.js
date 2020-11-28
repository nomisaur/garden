import React from "react";
import { Plant } from "../plant";

const PlanterBox = ({ planterBoxState, setPlanterBoxState }) => {
  return (
    <div>
      {planterBoxState.plants.map((plantState, index) => {
        return (
          <Plant
            key={index}
            plantState={plantState}
            setPlantState={(plantState) => {
              setPlanterBoxState({ plantIndex: index, plantState });
            }}
          />
        );
      })}
    </div>
  );
};

export { PlanterBox };
