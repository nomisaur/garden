import React, { useReducer } from 'react';
import { useAutoSave, useFancyReducer } from './hooks';
import { handlers } from './stateHandlers';
import { config } from './config';
import styled from 'styled-components';

import { Garden } from './components/garden';

const ColorDiv = styled.div`
  color: ${({ color = 'blue' }) => color};
`;

const App = ({ initialState }) => {
  const [state, setState] = useFancyReducer(handlers, initialState);

  useAutoSave(state, config.autosave);

  if (config.isDev) {
    window.seeState = () => console.log(state);
  }

  return (
    <ColorDiv>
      <ColorDiv color='red'>hi :)</ColorDiv>
      <div>plant matter: {state.plantMatter}</div>
      <Garden state={state} setState={setState} />
    </ColorDiv>
  );
};
export { App };
