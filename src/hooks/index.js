import { useState, useEffect, useRef } from "react";

const useInterval = (callback, interval) => {
  const timer = useRef();

  useEffect(() => {
    timer.current = setInterval(callback, interval);
    return () => clearInterval(timer.current);
  }, []);
};

const useTimer = (initialStartTime, initialInterval, tick = 1000) => {
  const [interval, _setInterval] = useState(initialInterval);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useInterval(() => setCurrentTime(Date.now()), tick);

  const timerBeep = currentTime - startTime > interval;
  const resetTimer = (newInterval) => {
    newInterval && _setInterval(newInterval);
    setStartTime(Date.now());
  };

  return [timerBeep, resetTimer];
};

export { useInterval, useTimer };
