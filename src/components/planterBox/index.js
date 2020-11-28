import React from "react";
import { Plant } from "../plant";

import "./styles.scss";

const PlanterBox = ({ planterBoxState, setPlanterBoxState, harvest }) => {
  return (
    <div className={"planterBox"}>
      {planterBoxState.plants.map((plantState, index) => {
        return (
          <Plant
            key={index}
            plantState={plantState}
            setPlantState={(plantState, harvest) => {
              setPlanterBoxState({ plantIndex: index, plantState, harvest });
            }}
          />
        );
      })}
    </div>
  );
};

export { PlanterBox };
