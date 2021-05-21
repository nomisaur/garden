import React from 'react';
import { useAutoSave, useFancyReducer, useCurrentTime } from './hooks';
import { handlers } from './stateHandlers';
import { config } from './config';
import styled from 'styled-components';
import { AppContext } from './hooks';

import { Garden } from './components/garden';

const AppStyle = styled.div`
  background-color: #000;
  color: #fff;
  font-size: large;
  font-family: monospace;
  min-height: 100vh;
`;

const App = ({ initialState }) => {
  const [state, setState] = useFancyReducer(handlers, initialState);

  const currentTime = useCurrentTime();

  //useAutoSave(state, config.autosave);

  if (config.isDev) {
    window.dev.showState = () => console.log(state);
    window.dev.forceState = (func) => setState('forceState', func);
  }

  return (
    <AppStyle>
      <AppContext.Provider value={{ state, setState, currentTime }}>
        <div>plant matter: {state.plantMatter}</div>
        <Garden />
      </AppContext.Provider>
    </AppStyle>
  );
};
export { App };
