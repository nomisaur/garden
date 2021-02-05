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
import { clone } from '../utils/pureUtils';

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const save = (state, message = 'saved') => {
  localForage
    .setItem('savedState', state)
    .then(() => log(message))
    .catch(log);
};

const useFancyReducer = (handlers, initialState) => {
  const [state, setState] = useReducer(
    (state, [action, payload]) => handlers[action](clone(state), payload),
    initialState,
  );

  save(state, 'saved on state change');

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

const useTimer = (initialStartTime, initialInterval, tick = 200) => {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [interval, setInterval] = useState(initialInterval);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useInterval(() => setCurrentTime(Date.now()), tick);

  const timerBeeps = Math.floor((currentTime - startTime) / interval);

  const resetTimer = ({ startTime, interval } = {}) => {
    const now = Date.now();
    interval && setInterval(interval);
    setStartTime(startTime || now);
    setCurrentTime(now);
  };

  return [timerBeeps, resetTimer];
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
  useTimer,
  useAutoSave,
  useFancyReducer,
  useCurrentTime,
};
