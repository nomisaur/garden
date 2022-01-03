import React from 'react';
import { config } from '../../config';
import { useAppContext, useInterval, useDevFunctions } from '../../hooks';

import { update } from './update';

import { InlineDiv } from '../styled';
import { Planter } from '../planter';

export const Garden = () => {
   const { state, handleState } = useAppContext();

   const setPaused = useInterval(
      () => Date.now() >= state.timeAtWhichToUpdate && handleState(update),
      config.ticRate,
      [state],
   );

   useDevFunctions({
      stop: () => setPaused(true),
      start: () => setPaused(false),
   });

   return (
      <InlineDiv>
         {state.planters.map((_, planterIndex) => (
            <Planter key={planterIndex} planterIndex={planterIndex} />
         ))}
      </InlineDiv>
   );
};
