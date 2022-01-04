import {
   useState,
   useEffect,
   useRef,
   useReducer,
   useContext,
   createContext,
} from 'react';
import localForage from 'localforage';
import { config } from './config';
import { clone, log } from './utils';
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
   const paused = useRef(false);
   useEffect(() => {
      timer.current = setInterval(
         () => !paused.current && callback(),
         interval,
      );
      return () => clearInterval(timer.current);
   }, deps);
   return (bool) => {
      paused.current = bool;
      log(bool ? 'paused' : 'unpaused');
   };
};

export const useDevFunctions = (functions = {}) => {
   useEffect(() => {
      if (config.isDev) {
         window.dev = {
            ...window.dev,
            ...functions,
         };
      }
   }, []);
};

export const useDidMountEffect = (func, deps = []) => {
   const didMount = useRef(false);
   const cleanup = useRef(() => {});
   useEffect(() => {
      if (didMount.current) {
         cleanup.current = func();
      } else {
         didMount.current = true;
      }
      return cleanup.current;
   }, deps);
};
