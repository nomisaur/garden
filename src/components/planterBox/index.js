import React from "react";
import { Patch } from "../patch";

import { addToPayload } from "../../utils";
import styled from "styled-components";

const PlanterBoxDiv = styled.div`
  display: flex;
`;

const PlanterBox = ({ planterBoxState, setState }) => {
  return (
    <PlanterBoxDiv>
      {planterBoxState.patches.map((patchState, patchIndex) => {
        return (
          <Patch
            key={patchIndex}
            patchState={patchState}
            setState={addToPayload(setState, { patchIndex })}
          />
        );
      })}
    </PlanterBoxDiv>
  );
};

export { PlanterBox };
