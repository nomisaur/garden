import React, { useState, useEffect, useRef } from "react";
import { useTimer } from "../../hooks";

import "./styles.scss";

const phases = ["___", "_._", "_:_", "_+_"];

const Plant = () => {
  const [phase, setPhase] = useState(0);

  const [timerBeep, resetTimer] = useTimer(Date.now(), 3000);

  const canGrow = phase < phases.length - 1;

  if (canGrow && timerBeep) {
    setPhase(phase + 1);
    resetTimer();
  }

  return (
    <div className="plant">
      <p>{phases[phase]}</p>
    </div>
  );
};

export { Plant };
