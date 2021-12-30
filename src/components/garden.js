import React from 'react';
import { useAppContext } from '../hooks';

import { InlineDiv } from './styled';
import { Planter } from './planter';

export const Garden = () => {
   const { state } = useAppContext();
   return (
      <InlineDiv>
         {state.planters.map((_, planterIndex) => (
            <Planter key={planterIndex} planterIndex={planterIndex} />
         ))}
      </InlineDiv>
   );
};
