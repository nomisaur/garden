import React, { useState, useEffect, useRef } from "react";

import { useTimer } from "../../hooks";
import { plants } from "../../plants";

import "./styles.scss";

const Plant = ({ plantState, setState }) => {
  const { type, phase, startTime } = plantState;
  const plant = plants[type];
  const maxGrowth = plant.phases.length - 1;

  const [timerBeeps, resetTimer] = useTimer(
    startTime,
    plant.phases[phase].duration
  );

  const setPlantState = (phase) => {
    const startTime = Date.now();
    setState("grow", {
      startTime,
      phase,
    });
    resetTimer({ startTime, interval: plant.phases[phase].duration });
  };

  const fullyGrown = phase === maxGrowth;

  useEffect(() => {
    if (!fullyGrown && timerBeeps) {
      setPlantState(Math.min(phase + timerBeeps, maxGrowth));
    }
  });

  return (
    <div
      className="plant"
      onClick={() => {
        fullyGrown && setState("harvest");
      }}
    >
      {plant.phases[phase].image}
    </div>
  );
};

export { Plant };
