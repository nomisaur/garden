import React from "react";
import { Patch } from "../patch";

import { addToPayload } from "../../utils";

import "./styles.scss";

const PlanterBox = ({ planterBoxState, setState }) => {
  return (
    <div className={"planterBox"}>
      {planterBoxState.patches.map((patchState, patchIndex) => {
        return (
          <Patch
            key={patchIndex}
            patchState={patchState}
            setState={addToPayload(setState, { patchIndex })}
          />
        );
      })}
    </div>
  );
};

export { PlanterBox };
