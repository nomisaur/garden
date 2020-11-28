import React from "react";
import { Plant } from "../plant";

import { addToPayload } from "../../utils";
import "./styles.scss";

const soil = `
     
     
     
~~~~~
`;

const Patch = ({ patchState, setState }) => {
  const { empty, plant: plantState } = patchState;

  const onClick = () => {
    empty && setState("plant", { type: "popper" });
  };

  return (
    <div className={"patch"} onClick={onClick}>
      {empty ? soil : <Plant plantState={plantState} setState={setState} />}
    </div>
  );
};

export { Patch };
