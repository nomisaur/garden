import React from 'react';
import { useAppContext } from '../hooks';

import { InlineDiv } from './styled';
import { itemModels } from '../models';

export const Inventory = () => {
  const { state, handleState, currentTime } = useAppContext();
  return (
    <InlineDiv>
      {state.inventory.map(({ item, amount }, index) => {
        return (
          <div key={index}>
            {amount > 0 && (
              <>
                <div>{itemModels[item].name}</div>
                <div>{amount}</div>
              </>
            )}
          </div>
        );
      })}
    </InlineDiv>
  );
};
