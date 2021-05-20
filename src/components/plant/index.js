import React, { useEffect } from 'react';

import { useAppContext } from '../../hooks';
import { plantModels } from '../../models';
import { shouldUpdateLevels } from '../../models/plantUtils';

import styled from 'styled-components';
const PlantDiv = styled.div`
  color: green;
`;

const Status = styled.div`
  font-size: small;
`;

const Plant = ({ plantState, setState }) => {
  const { type, lifeStage, waterLevel } = plantState;
  const plantModel = plantModels[type];
  const { image, healthyMax, healthyMin } = plantModel.lifeStages[lifeStage];
  const fullyGrown = plantState.lifeStage === plantModel.lifeStages - 1;
  const status =
    waterLevel < healthyMin
      ? 'dry'
      : waterLevel > healthyMax
      ? 'wet'
      : 'healthy';
  return (
    <>
      <PlantDiv onClick={() => fullyGrown && setState('harvest')}>
        {image}
      </PlantDiv>
      <Status>
        <div>status: {status}</div>
        <div>plant water level: {waterLevel}</div>
      </Status>
    </>
  );

  /* const { type, phase, waterLevel } = plantState;

  const { phases } = plantModels[type];

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

  const { image, healthyMin, healthyMax } = phases[phase];
  const status =
    waterLevel < healthyMin
      ? 'dry'
      : waterLevel > healthyMax
      ? 'wet'
      : 'healthy';

  return (
    <>
      <PlantDiv onClick={() => fullyGrown && setState('harvest')}>
        {image}
      </PlantDiv>
      <Status>
        <div>{status}</div>
        <div>{waterLevel}</div>
      </Status>
    </>
  ); */
};

export { Plant };
