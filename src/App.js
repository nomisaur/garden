import React, { useState } from 'react';
import styled from 'styled-components';

import { config } from './config';
import { time } from './utils';
import { log } from './log';
import { handlers } from './stateHandlers';
import {
  AppContext,
  useAutoSave,
  useFancyReducer,
  useCurrentTime,
} from './hooks';

import { Main } from './components/main';

const AppStyle = styled.div`
  background-color: #000;
  color: #fff;
  font-size: large;
  font-family: monospace;
  min-height: 100vh;
`;

export const App = ({ initialState }) => {
  const [state, setState] = useFancyReducer(handlers, initialState);
  const currentTime = useCurrentTime();
  useAutoSave(state, config.autosave);

  const [isTimePaused, setIsTimePaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  if (config.isDev) {
    window.dev.showState = () => log(state);
    window.dev.forceState = (func) => setState('forceState', func);
    window.dev.stop = () => {
      setIsTimePaused(true);
      setPausedTime(currentTime);
    };
    window.dev.start = () => setIsTimePaused(false);
    window.dev.jump = (amount) => setPausedTime(pausedTime + time(amount));
  }

  return (
    <AppStyle>
      <AppContext.Provider
        value={{
          state,
          setState,
          currentTime: isTimePaused ? pausedTime : currentTime,
        }}
      >
        <Main />
      </AppContext.Provider>
    </AppStyle>
  );
};
