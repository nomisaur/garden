import React, { useState } from 'react';
import { useAutoSave, useFancyReducer, useCurrentTime } from './hooks';
import { handlers } from './stateHandlers';
import { config } from './config';
import styled from 'styled-components';
import { AppContext } from './hooks';

import { Garden } from './components/garden';
import { time } from './utils';
import { log } from './log';

const AppStyle = styled.div`
  background-color: #000;
  color: #fff;
  font-size: large;
  font-family: monospace;
  min-height: 100vh;
`;

const App = ({ initialState }) => {
  const [state, setState] = useFancyReducer(handlers, initialState);
  const [timeOn, setTimeOn] = useState(true);
  const [pauseTime, setPauseTime] = useState(0);

  const currentTime = useCurrentTime();

  useAutoSave(state, config.autosave);

  if (config.isDev) {
    window.dev.showState = () => log(state);
    window.dev.forceState = (func) => setState('forceState', func);
    window.dev.stop = () => {
      setTimeOn(false);
      setPauseTime(currentTime);
    };
    window.dev.start = () => setTimeOn(true);
    window.dev.jump = (amount) => setPauseTime(pauseTime + time(amount));
  }

  return (
    <AppStyle>
      <AppContext.Provider
        value={{
          state,
          setState,
          currentTime: timeOn ? currentTime : pauseTime,
        }}
      >
        <div>plant matter: {state.plantMatter}</div>
        <Garden />
      </AppContext.Provider>
    </AppStyle>
  );
};
export { App };
