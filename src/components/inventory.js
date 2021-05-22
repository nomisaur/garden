import React from 'react';
import { useAppContext } from '../hooks';

import { InlineDiv } from './styled';

export const Inventory = () => {
  const { state, handleState, currentTime } = useAppContext();
  return (
    <InlineDiv>
      {Object.entries(state.inventory).map(([item, amount], index) => {
        return (
          <div key={index}>
            <div>{item}</div>
            <div>{amount}</div>
          </div>
        );
      })}
    </InlineDiv>
  );
};
