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

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const save = (state, message = 'saved') => {
  localForage
    .setItem('savedState', state)
    .then(() => log(message))
    .catch(log);
};

export const useFancyReducer = (handlers, initialState) => {
  const [state, setState] = useReducer((state, [action, payload]) => {
    const handler = handlers[action];
    const newState = handler(clone(state), payload);
    !handler.shouldNotSave && save(newState, 'saved on state change');
    return newState;
  }, initialState);
  return [state, (action, payload) => setState([action, payload])];
};

const useInterval = (callback, interval) => {
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
