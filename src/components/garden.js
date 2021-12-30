import React from 'react';
import { useAppContext } from '../hooks';
import { addToPayload } from '../utils';

import { InlineDiv } from './styled';
import { Planter } from './planter';

export const Garden = () => {
   const { state } = useAppContext();
   return (
      <InlineDiv>
         {state.planters.map((planterState, planterIndex) => (
            <Planter
               key={planterIndex}
               planterIndex={planterIndex}
               planterState={planterState}
            />
         ))}
      </InlineDiv>
   );
};
