import React, { useState, useEffect, useRef } from "react";

import { useTimer } from "../../hooks";

import "./styles.scss";

const phases = ["___", "_._", "_:_", "_+_"];

const Plant = ({ phase, setPhase, startTime }) => {
  const [timerBeeps, resetTimer] = useTimer(startTime, 10000);

  const canGrow = phase < phases.length - 1;

  if (timerBeeps) {
    const now = Date.now();
    setPhase(Math.min(phase + timerBeeps, phases.length - 1), now);
    resetTimer({ startTime: now });
  }

  return (
    <div className="plant">
      <p>{phases[phase]}</p>
    </div>
  );
};

export { Plant };
