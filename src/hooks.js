import {
   useState,
   useEffect,
   useRef,
   useReducer,
   useContext,
   createContext,
} from 'react';
import localForage from 'localforage';
import { isDev } from './config';
import { clone, log } from './utils';
import { getState } from './state';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const MusicContext = createContext();
export const useMusicContext = () => useContext(MusicContext);

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
      const handlerName = handler.name || 'anonymous handler';
      log(`state change (${handlerName})`, newState);
      !handler.shouldNotSave && save(newState, `saved on ${handlerName}`);
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
      if (isDev) {
         window.dev = {
            ...window.dev,
            ...functions,
         };
      }
   }, []);
};

export const useCountEffect = (func, deps = []) => {
   const count = useRef(0);
   const cleanup = useRef(() => {});
   useEffect(() => {
      cleanup.current = func(count.current);
      count.current = count.current + 1;
      return cleanup.current;
   }, deps);
};

export const useDidMountEffect = (func, deps = []) => {
   useCountEffect((count) => {
      if (count > 0) {
         return func();
      }
   }, deps);
};

export const useWindowDimensions = () => {
   const [windowDimensions, setWindowDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
   });

   useEffect(() => {
      const handleResize = () => {
         setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
         });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   return windowDimensions;
};
