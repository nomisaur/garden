import React, { useState, useEffect, useRef } from "react";

import { useTimer } from "../../hooks";

import "./styles.scss";

const phases = ["___", "_._", "_:_", "_|_", "_+_"];
const maxGrowth = phases.length - 1;

const Plant = ({ plantState, setState }) => {
  const { phase, startTime } = plantState;
  const [timerBeeps, resetTimer] = useTimer(startTime, 5000);

  const setPlantState = (phase, harvest = false) => {
    const now = Date.now();
    setState({
      action: "setPlantState",
      payload: { plantState: { startTime: now, phase }, harvest },
    });
    resetTimer({ startTime: now });
  };

  const planted = phase > 0;

  const fullyGrown = phase === maxGrowth;

  if (planted && !fullyGrown && timerBeeps) {
    setPlantState(Math.min(phase + timerBeeps, maxGrowth));
  }

  return (
    <div
      className="plant"
      onClick={() => {
        !planted && setPlantState(1);
        fullyGrown && setPlantState(0, true);
      }}
    >
      <p>{phases[phase]}</p>
    </div>
  );
};

export { Plant };
