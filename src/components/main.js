import React from 'react';
import { useAppContext } from '../hooks';

import { StyledButton, InlineDiv } from './styled';
import { Garden } from './garden';
import { Music } from './music';

const screens = {
   garden: <Garden />,
   shop: <div>hi im shop</div>,
   notes: <Music />,
};

export const Main = () => {
   const { state, handleState } = useAppContext();

   const openScreen = (screen) => () => {
      handleState(({ state }) => {
         state.screen = screen;
         return state;
      });
   };

   return (
      <>
         <InlineDiv>
            <StyledButton onClick={openScreen('garden')}>garden</StyledButton>
            <StyledButton onClick={openScreen('shop')}>shop</StyledButton>
            <StyledButton onClick={openScreen('notes')}>notes</StyledButton>
         </InlineDiv>
         {screens[state.screen]}
      </>
   );
};
