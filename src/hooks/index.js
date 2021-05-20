import {
  useState,
  useEffect,
  useRef,
  useReducer,
  useContext,
  createContext,
} from 'react';
import localForage from 'localforage';
import { log } from '../log';
import { clone } from '../utils';

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const save = (state, message = 'saved') => {
  localForage
    .setItem('savedState', state)
    .then(() => log(message))
    .catch(log);
};

const useFancyReducer = (handlers, initialState) => {
  const [state, setState] = useReducer((state, [action, payload]) => {
    const newState = handlers[action](clone(state), payload);
    save(newState, 'saved on state change');
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

const useCurrentTime = (tick = 200) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useInterval(() => setCurrentTime(Date.now()), tick);
  return currentTime;
};

const useAutoSave = (state, interval) => {
  const stateRef = useRef(state);
  stateRef.current = state;
  useInterval(() => save(stateRef.current, 'auto saved'), interval);
};

export {
  AppContext,
  useAppContext,
  useInterval,
  useAutoSave,
  useFancyReducer,
  useCurrentTime,
};
