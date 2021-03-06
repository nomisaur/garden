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

  const openScreen = (screen) => () => {
    handleState((state) => {
      state.screen = screen;
      return state;
    });
  };

  return (
    <>
      <InlineDiv>
        <StyledButton onClick={openScreen('garden')}>garden</StyledButton>
        <StyledButton onClick={openScreen('shop')}>shop</StyledButton>
      </InlineDiv>
      <div>plant matter: {state.plantMatter}</div>
      {screens[state.screen]}
    </>
  );
};
