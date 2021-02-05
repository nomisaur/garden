import React, { useEffect } from 'react';

import { useAppContext } from '../../hooks';
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

  const fullyGrown = phase === phases.length - 1;

  const { currentTime } = useAppContext();

  const { shouldUpdatePhase, shouldUpdateWater } = shouldUpdateLevels(
    plantState,
    currentTime,
  );
  const updateLevels = shouldUpdatePhase || shouldUpdateWater;

  useEffect(() => {
    if (updateLevels) {
      setState('updateLevels', { currentTime });
    }
  }, [updateLevels]);

  const { image, waterLevels } = phases[phase];
  const { status } = waterLevels[waterLevel];

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
