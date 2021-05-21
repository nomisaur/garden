import React from 'react';
import styled from 'styled-components';
import { Planter } from './planter';
import { useAppContext } from '../hooks';

import { addToPayload } from '../utils';

const InlineDiv = styled.div`
  display: flex;
  font-size: small;
`;

const Garden = () => {
  const { state, setState, currentTime } = useAppContext();
  return (
    <InlineDiv>
      {state.planters.map((planterState, planterIndex) => {
        return (
          <Planter
            key={planterIndex}
            planterState={planterState}
            setState={addToPayload(setState, { planterIndex, currentTime })}
          />
        );
      })}
    </InlineDiv>
  );
};

export { Garden };
