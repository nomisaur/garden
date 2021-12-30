import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import { config } from './config';
import { time } from './utils';
import { log } from './log';
import { update } from './components/planter/handlers';
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
   const [state, handleState] = useFancyReducer(initialState);

   const timer = useRef();
   const updating = useRef(false);
   useEffect(() => {
      updating.current = false;
      timer.current = setInterval(() => {
         if (updating.current) {
            return;
         }
         const { timeAtWhichToUpdate } = state;
         const currentTime = Date.now();
         if (currentTime < timeAtWhichToUpdate) {
            console.log('return');
            return;
         }
         updating.current = true;
         clearInterval(timer.current);
         handleState(update, currentTime);
      }, 200);
      return () => clearInterval(timer.current);
   }, [state]);

   //const currentTime = useCurrentTime();
   //useAutoSave(state, config.autosave);

   //const [isTimePaused, setIsTimePaused] = useState(false);
   //const [pausedTime, setPausedTime] = useState(0);

   /* useEffect(() => {
      if (config.isDev) {
         window.dev.showState = () => log(state);
         window.dev.forceState = (func) =>
            handleState((state) => {
               func(state);
               return state;
            });
         window.dev.stop = () => {
            setIsTimePaused(true);
            setPausedTime(currentTime);
         };
         window.dev.start = () => setIsTimePaused(false);
         window.dev.jump = (amount) => setPausedTime(pausedTime + time(amount));
      }
   }, []); */

   console.log('App render');

   return (
      <React.StrictMode>
         <AppStyle>
            <AppContext.Provider
               value={{
                  state,
                  handleState,
                  //currentTime: isTimePaused ? pausedTime : currentTime,
               }}
            >
               <Main />
            </AppContext.Provider>
         </AppStyle>
      </React.StrictMode>
   );
};
