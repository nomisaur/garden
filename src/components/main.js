import React from 'react';
import { useAppContext } from '../hooks';

import { StyledButton, InlineDiv } from './styled';
import { Garden } from './garden';

const screens = {
  garden: <Garden />,
  shop: <div>hi im shop</div>,
};

export const Main = () => {
  const { state, handleState } = useAppContext();
  return (
    <>
      <InlineDiv>
        <StyledButton
          onClick={() =>
            handleState((state) => {
              state.screen = 'garden';
              return state;
            })
          }
        >
          garden
        </StyledButton>
        <StyledButton
          onClick={() =>
            handleState((state) => {
              state.screen = 'shop';
              return state;
            })
          }
        >
          shop
        </StyledButton>
      </InlineDiv>
      <div>plant matter: {state.plantMatter}</div>
      {screens[state.screen]}
    </>
  );
};
