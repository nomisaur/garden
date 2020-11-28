import React from "react";
import { Plant } from "../plant";

import { addToPayload } from "../../utils";

import "./styles.scss";

const PlanterBox = ({ planterBoxState, setState }) => {
  return (
    <div className={"planterBox"}>
      {planterBoxState.plants.map((plantState, plantIndex) => {
        return (
          <Plant
            key={plantIndex}
            plantState={plantState}
            setState={addToPayload(setState, { plantIndex })}
          />
        );
      })}
    </div>
  );
};

export { PlanterBox };
