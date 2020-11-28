import React, { useState, useEffect, useRef } from "react";

import { useTimer } from "../../hooks";

import "./styles.scss";

const phases = ["___", "_._", "_:_", "_|_", "_+_"];

const Plant = ({
  plantState,
  setPlantState: _setPlantState,
  harvest: _harvest,
}) => {
  const setPlantState = (phase) => {
    const now = Date.now();
    _setPlantState({ startTime: now, phase });
    resetTimer({ startTime: now });
  };

  const harvest = () => {
    const now = Date.now();
    _harvest({ startTime: now, phase: 0 });
    resetTimer({ startTime: now });
  };

  const { phase, startTime } = plantState;
  const [timerBeeps, resetTimer] = useTimer(startTime, 5000);

  const planted = phase > 0;

  const fullyGrown = phase === phases.length - 1;

  if (planted && !fullyGrown && timerBeeps) {
    setPlantState(phase + timerBeeps);
  }

  return (
    <div
      className="plant"
      onClick={() => {
        !planted && setPlantState(1);
        fullyGrown && harvest();
      }}
    >
      <p>{phases[phase]}</p>
    </div>
  );
};

export { Plant };
