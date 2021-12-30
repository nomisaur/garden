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

export const save = (state, message = 'saved') => {
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
      !handler.shouldNotSave && save(newState, 'saved on state change');
      console.log('newState', newState);
      return newState;
   }, initialState);
   return [
      getState(state),
      (handler, payload) => handleState([handler, payload]),
   ];
};

export const useInterval = (callback, interval) => {
   const timer = useRef();
   useEffect(() => {
      timer.current = setInterval(callback, interval);
      return () => clearInterval(timer.current);
   }, []);
};

export const useCurrentTime = (tick = 200) => {
   const [currentTime, setCurrentTime] = useState(Date.now());
   useInterval(() => setCurrentTime(Date.now()), tick);
   return currentTime;
};

export const useAutoSave = (state, interval) => {
   const stateRef = useRef(state);
   stateRef.current = state;
   useInterval(() => save(stateRef.current, 'auto saved'), interval);
};
