import React, { useState } from "react";

import "./styles.scss";

import { saveData } from "../../saveData";

const phases = ["___", "_._", "_:_", "_+_"];

const Plant = () => {
  const { phase } = saveData.plant;

  const [timeoutSet, setTimeoutSet] = useState(false);

  if (!timeoutSet && phase < phases.length - 1) {
    setTimeout(() => {
      saveData.plant.phase = phase + 1;
      setTimeoutSet(false);
    }, 3000);
    setTimeoutSet(true);
  }
  return (
    <div className="plant">
      <p>{phases[phase]}</p>
    </div>
  );
};

export { Plant };
