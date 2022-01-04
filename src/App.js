import React, { useState } from 'react';
import styled from 'styled-components';

import { log } from './utils';
import { AppContext, useFancyReducer, useDevFunctions } from './hooks';

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
   const [hasInteracted, setHasInteracted] = useState(false);

   useDevFunctions({
      showState: () => log(state),
      forceState: (func) =>
         handleState(({ state }) => {
            func(state);
            return state;
         }),
   });

   return (
      <React.StrictMode>
         <AppStyle onClick={() => !hasInteracted && setHasInteracted(true)}>
            <AppContext.Provider value={{ state, handleState, hasInteracted }}>
               <Main />
            </AppContext.Provider>
         </AppStyle>
      </React.StrictMode>
   );
};
