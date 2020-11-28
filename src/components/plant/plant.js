import React, { useState, useEffect, useRef } from "react";

import { useTimer } from "../../hooks";

import "./styles.scss";

const phases = ["___", "_._", "_:_", "_+_"];

const Plant = ({ phase, setPhase, startTime }) => {
  const [timerBeep, resetTimer] = useTimer(startTime, 1000);

  const canGrow = phase < phases.length - 1;

  if (timerBeep) {
    const now = Date.now();
    setPhase(phase + 1, now);
    resetTimer({ startTime: now });
  }

  return (
    <div className="plant">
      <p>{phase}</p>
    </div>
  );
};

export { Plant };
