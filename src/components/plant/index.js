import React, { useState, useEffect, useRef } from "react";

import { useTimer } from "../../hooks";

import "./styles.scss";

const phases = ["___", "_._", "_:_", "_+_"];

const Plant = ({ plantState, setPlantState: _setPlantState }) => {
  const setPlantState = (phase) => {
    const now = Date.now();
    _setPlantState({ startTime: now, phase });
    resetTimer({ startTime: now });
  };

  const { phase, startTime } = plantState;
  const [timerBeeps, resetTimer] = useTimer(startTime, 3000);

  const planted = phase > 0;

  const fullyGrown = phase === phases.length - 1;

  if (planted && !fullyGrown && timerBeeps) {
    setPlantState(phase + timerBeeps);
  }

  return (
    <div
      className="plant"
      onClick={() => {
        setPlantState(1);
      }}
    >
      <p>{phases[phase]}</p>
    </div>
  );
};

export { Plant };
