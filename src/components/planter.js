import React, { useEffect } from 'react';
import { StyledImage, StyledButton } from './styled';
import { soilModels, plantModels, planter } from '../models';
import { shouldUpdate } from '../stateHandlers';
import { useAppContext } from '../hooks';
import { getPlanterState } from '../state';

const Planter = ({ planterState, setState }) => {
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
      setState('update');
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
        {planter}
      </StyledImage>

      {hasPlant && <div>status: {status}</div>}
      {hasPlant && <div>hydration: {hydration}</div>}
      {hasSoil && <div>water lvl: {waterLevel}</div>}

      {!hasSoil && (
        <StyledButton onClick={() => setState('soil', { type: 'starter' })}>
          add soil
        </StyledButton>
      )}
      {hasSoil && (
        <StyledButton onClick={() => setState('water')}>water</StyledButton>
      )}
      {hasSoil && !hasPlant && (
        <StyledButton onClick={() => setState('plant', { type: 'pennyPlant' })}>
          add plant
        </StyledButton>
      )}
      {hasPlant && fullyGrown && (
        <StyledButton onClick={() => setState('harvest')}>harvest</StyledButton>
      )}
    </div>
  );
};

export { Planter };
