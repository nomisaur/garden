import React, { useState, useEffect, useRef } from "react";

import { useTimer } from "../../hooks";

import "./styles.scss";

const phases = ["___", "_._", "_:_", "_+_"];

const Plant = ({ phase, setPhase, startTime }) => {
  const [timerBeeps, resetTimer] = useTimer(startTime, 1000);

  const canGrow = phase < phases.length - 1;

  if (timerBeeps) {
    const now = Date.now();
    setPhase(phase + timerBeeps, now);
    resetTimer({ startTime: now });
  }

  return (
    <div className="plant">
      <p>{phase}</p>
    </div>
  );
};

export { Plant };
