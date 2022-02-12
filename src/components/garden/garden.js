import React from 'react';
import { ticRate } from '../../config';
import { useAppContext, useInterval, useDevFunctions } from '../../hooks';

import { update } from './update';

import { InlineDiv } from '../styled';
import { Planter } from '../planter';
import { Inventory } from '../inventory';

export const Garden = () => {
   const { state, handleState } = useAppContext();

   const setPaused = useInterval(
      () => Date.now() >= state.timeAtWhichToUpdate && handleState(update),
      ticRate,
      [state],
   );

   useDevFunctions({
      stop: () => setPaused(true),
      start: () => setPaused(false),
   });

   return (
      <>
         <Inventory />
         <InlineDiv>
            {state.planters.map((_, planterIndex) => (
               <Planter key={planterIndex} planterIndex={planterIndex} />
            ))}
         </InlineDiv>
      </>
   );
};
