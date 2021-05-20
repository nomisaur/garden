import React from 'react';
import { useAutoSave, useFancyReducer, useCurrentTime } from './hooks';
import { handlers } from './stateHandlers';
import { config } from './config';
import styled from 'styled-components';
import { AppContext } from './hooks';

import { Garden } from './components/garden';

const ColorDiv = styled.div`
  color: ${({ color = 'blue' }) => color};
`;

const App = ({ initialState }) => {
  const [state, setState] = useFancyReducer(handlers, initialState);

  const currentTime = useCurrentTime();

  //useAutoSave(state, config.autosave);

  if (config.isDev) {
    window.seeState = () => console.log(state);
  }

  return (
    <AppContext.Provider value={{ state, setState, currentTime }}>
      <ColorDiv>
        <ColorDiv color='red'>hi :)</ColorDiv>
        <div>plant matter: {state.plantMatter}</div>
        <Garden />
      </ColorDiv>
    </AppContext.Provider>
  );
};
export { App };
