import React, { useEffect } from 'react';
import { StyledImage, StyledButton } from './styled';
import { soilModels, plantModels, planter } from '../models';
import { shouldUpdate } from '../stateHandlers';
import { useAppContext } from '../hooks';

const Planter = ({ planterState, setState }) => {
  const { currentTime } = useAppContext();
  const {
    hasSoil,
    soil: {
      hasPlant,
      type: soilType,
      waterLevel,
      plant: { type: plantType, lifeStage, hydration },
    },
  } = planterState;

  const { lifeStages } = hasPlant ? plantModels[plantType] : {};
  const { image: plantImage, healthyMax, healthyMin } = hasPlant
    ? lifeStages[lifeStage]
    : {};

  const fullyGrown = hasPlant && lifeStage === lifeStages.length - 1;
  const status =
    hasPlant && hydration < healthyMin
      ? 'dry'
      : hydration > healthyMax
      ? 'wet'
      : 'healthy';

  const { shouldDoUpdate = false } = hasSoil
    ? shouldUpdate(planterState.soil, currentTime)
    : {};

  useEffect(() => {
    if (shouldDoUpdate) {
      setState('update');
    }
  }, [shouldDoUpdate]);

  return (
    <div>
      <StyledImage color='green'>
        {hasPlant ? plantImage : plantModels.empty}
      </StyledImage>
      <StyledImage color='brown' lineHeight={0.25}>
        {hasSoil ? soilModels[soilType].image : soilModels.empty}
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
