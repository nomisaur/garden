import React, { useEffect } from 'react';
import { useAppContext } from '../../hooks';
import { getPlanterState } from '../../state';
import { soilModels, plantModels, planterImage } from '../../models';
import { shouldUpdate, plant, soil, harvest, update, water } from './handlers';

import { StyledImage, StyledButton } from '../styled';

export const Planter = ({ planterState, handleState }) => {
  const { currentTime } = useAppContext();
  const fullPlanterState = getPlanterState(planterState);

  const {
    hasSoil,
    hasPlant,
    waterLevel,
    hydration,
    fullyGrown,
    status,
    plantImage,
    soilImage,
  } = fullPlanterState;

  useEffect(() => {
    if (shouldUpdate(fullPlanterState, currentTime).shouldDoUpdate) {
      handleState(update);
    }
  });

  return (
    <div>
      <StyledImage color='green'>
        {hasPlant ? plantImage : plantModels.empty}
      </StyledImage>
      <StyledImage color='brown' lineHeight={0.25}>
        {hasSoil ? soilImage : soilModels.empty}
      </StyledImage>
      <StyledImage color='grey' lineHeight={0.25} marginBottom={'10px'}>
        {planterImage}
      </StyledImage>

      {hasPlant && <div>status: {status}</div>}
      {hasPlant && <div>hydration: {hydration}</div>}
      {hasSoil && <div>water lvl: {waterLevel}</div>}

      {!hasSoil && (
        <StyledButton onClick={() => handleState(soil, { type: 'starter' })}>
          add soil
        </StyledButton>
      )}
      {hasSoil && (
        <StyledButton onClick={() => handleState(water)}>water</StyledButton>
      )}
      {hasSoil && !hasPlant && (
        <StyledButton
          onClick={() => handleState(plant, { type: 'pennyPlant' })}
        >
          add plant
        </StyledButton>
      )}
      {hasPlant && fullyGrown && (
        <StyledButton onClick={() => handleState(harvest)}>
          harvest
        </StyledButton>
      )}
    </div>
  );
};
