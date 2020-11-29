import React, { useState, useEffect, useRef } from 'react';

import { useTimer, useInterval, useCurrentTime } from '../../hooks';
import { plants } from '../../plants';

import styled from 'styled-components';
const PlantDiv = styled.div`
  color: green;
`;

const Status = styled.div`
  font-size: small;
`;

const Plant = ({ plantState, setState }) => {
  const {
    timeStamp,
    type,
    phase,
    phaseTimeLeft,
    waterLevel,
    waterTimeLeft,
  } = plantState;

  const { phases } = plants[type];
  const { image, waterLevels } = phases[phase];
  const { status } = waterLevels[waterLevel];

  const fullyGrown = phase === phases.length - 1;
  const fullyDry = waterLevel === 0;

  const currentTime = useCurrentTime();

  const timePassed = currentTime - timeStamp;

  const phaseBeep =
    !fullyGrown && status === 'healthy' && phaseTimeLeft < timePassed;
  const waterLevelBeep = !fullyDry && waterTimeLeft < timePassed;

  useEffect(() => {
    if (phaseBeep || waterLevelBeep) {
      setState('grow', { currentTime });
    }
  }, [phaseBeep, waterLevelBeep]);

  return (
    <>
      <PlantDiv onClick={() => fullyGrown && setState('harvest')}>
        {image}
      </PlantDiv>
      <Status>
        <div>{status}</div>
        <div>{waterLevel}</div>
        <button onClick={() => setState('water', { currentTime })}>
          water
        </button>
      </Status>
    </>
  );
};

export { Plant };
