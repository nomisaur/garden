import React from 'react';
import { useAppContext } from '../hooks';

import { StyledButton, InlineDiv } from './styled';
import { Garden } from './garden';

const screens = {
  garden: <Garden />,
  shop: <div>hi im shop</div>,
};

export const Main = () => {
  const { state, setState } = useAppContext();
  return (
    <>
      <InlineDiv>
        <StyledButton onClick={() => setState('screen', 'garden')}>
          garden
        </StyledButton>
        <StyledButton onClick={() => setState('screen', 'shop')}>
          shop
        </StyledButton>
      </InlineDiv>
      <div>plant matter: {state.plantMatter}</div>
      {screens[state.screen]}
    </>
  );
};
