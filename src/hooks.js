import {
   useState,
   useEffect,
   useRef,
   useReducer,
   useContext,
   createContext,
} from 'react';
import localForage from 'localforage';
import { log } from './log';
import { clone } from './utils';
import { getState } from './state';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const usePlanterContext = (planterIndex) => {
   const { state, handleState } = useAppContext();
   return {
      planterState: state.planters[planterIndex],
      handlePlanterState: (handler, payload = {}) =>
         handleState(handler, { planterIndex, ...payload }),
   };
};

const save = (state, message = 'saved') => {
   localForage
      .setItem('savedState', state)
      .then(() => log(message))
      .catch(log);
};

export const useFancyReducer = (initialState) => {
   const [state, handleState] = useReducer((state, [handler, payload]) => {
      const clonedState = clone(state);
      const newState = handler(
         {
            state: clonedState,
            fullState: getState(clonedState),
            currentTime: Date.now(),
         },
         payload,
      );
      log(`state change (${handler.name})`, newState);
      !handler.shouldNotSave && save(newState, `saved on ${handler.name}`);
      return newState;
   }, initialState);
   return [
      getState(state),
      (handler, payload) => handleState([handler, payload]),
   ];
};

export const useInterval = (callback, interval, deps = []) => {
   const timer = useRef();
   const [paused, setPaused] = useState(false);
   useEffect(() => {
      timer.current = setInterval(() => !paused && callback(), interval);
      return () => clearInterval(timer.current);
   }, deps);
   return (bool) => {
      setPaused(bool);
      log(bool ? 'paused' : 'unpaused');
   };
};
