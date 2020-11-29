import React, { useState, useEffect, useRef } from 'react';

import { useTimer, useInterval, useCurrentTime } from '../../hooks';
import { plants } from '../../plants';
import { shouldUpdateLevels } from '../../utils/plantUtils';

import styled from 'styled-components';
const PlantDiv = styled.div`
  color: green;
`;

const Status = styled.div`
  font-size: small;
`;

const Plant = ({ plantState, setState }) => {
  const { type, phase, waterLevel } = plantState;

  const { phases } = plants[type];
  const { image, waterLevels } = phases[phase];
  const { status } = waterLevels[waterLevel];

  const fullyGrown = phase === phases.length - 1;

  const currentTime = useCurrentTime();

  const { phaseBeep, waterBeep } = shouldUpdateLevels(plantState, currentTime);
  const updateLevels = phaseBeep || waterBeep;

  useEffect(() => {
    if (updateLevels) {
      setState('updateLevels', { currentTime });
    }
  }, [updateLevels]);

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
