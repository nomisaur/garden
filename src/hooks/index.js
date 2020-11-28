import { useState, useEffect, useRef } from "react";
import localForage from "localforage";

const useInterval = (callback, interval) => {
  const timer = useRef();

  useEffect(() => {
    timer.current = setInterval(callback, interval);
    return () => clearInterval(timer.current);
  });
};

const useTimer = (initialStartTime, initialInterval, tick = 20) => {
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
  console.log("auto save, ", state);
  useInterval(() => {
    localForage
      .setItem("savedState", state)
      .then(() => console.log("auto save"))
      .catch(console.log);
  }, interval);
};

export { useInterval, useTimer, useAutoSave };
