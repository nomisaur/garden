import { useState, useEffect, useRef } from "react";
import localForage from "localforage";

const useInterval = (callback, interval) => {
  const timer = useRef();

  useEffect(() => {
    timer.current = setInterval(callback, interval);
    return () => clearInterval(timer.current);
  }, []);
};

const useTimer = (initialStartTime, initialInterval, tick = 50) => {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [interval, setInterval] = useState(initialInterval);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useInterval(() => setCurrentTime(Date.now()), tick);

  const timerBeep = currentTime - startTime > interval;

  const resetTimer = ({ startTime, interval } = {}) => {
    interval && setInterval(interval);
    setStartTime(startTime || Date.now());
  };

  return [timerBeep, resetTimer];
};

const useAutoSave = (state, interval) => {
  useInterval(() => {
    localForage.setItem("savedState", state);
  }, interval);
};

export { useInterval, useTimer, useAutoSave };
