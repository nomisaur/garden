import React, { useEffect } from 'react';
import styled from 'styled-components';

import { config } from './config';
import { log } from './utils';
import { update } from './update';
import { AppContext, useFancyReducer, useInterval } from './hooks';

import { Main } from './components/main';

const AppStyle = styled.div`
   background-color: #000;
   color: #fff;
   font-size: large;
   font-family: monospace;
   min-height: 100vh;
`;

export const App = ({ initialState }) => {
   const [state, handleState] = useFancyReducer(initialState);

   const setPaused = useInterval(
      () => Date.now() >= state.timeAtWhichToUpdate && handleState(update),
      config.ticRate,
      [state],
   );

   useEffect(() => {
      if (config.isDev) {
         window.dev.showState = () => log(state);
         window.dev.forceState = (func) =>
            handleState(({ state }) => {
               func(state);
               return state;
            });
         window.dev.stop = () => setPaused(true);
         window.dev.start = () => setPaused(false);
      }
   }, []);

   return (
      <React.StrictMode>
         <AppStyle>
            <AppContext.Provider value={{ state, handleState }}>
               <Main />
            </AppContext.Provider>
         </AppStyle>
      </React.StrictMode>
   );
};
