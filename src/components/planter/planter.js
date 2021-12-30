import React from 'react';
import { usePlanterContext } from '../../hooks';
import { soilModels, plantModels, planterImage } from '../../models';
import { plant, soil, harvest, water } from './handlers';

import { StyledImage, StyledButton } from '../styled';

export const Planter = ({ planterIndex }) => {
   const { planterState, handlePlanterState } = usePlanterContext(planterIndex);

   const {
      hasSoil,
      hasPlant,
      waterLevel,
      hydration,
      status,
      plantImage,
      soilImage,
   } = planterState;

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
            <StyledButton
               onClick={() => handlePlanterState(soil, { type: 'starter' })}
            >
               add soil
            </StyledButton>
         )}
         {hasSoil && (
            <StyledButton onClick={() => handlePlanterState(water)}>
               water
            </StyledButton>
         )}
         {hasSoil && !hasPlant && (
            <StyledButton
               onClick={() => handlePlanterState(plant, { type: 'pennyPlant' })}
            >
               add plant
            </StyledButton>
         )}
         {hasPlant && (
            <StyledButton onClick={() => handlePlanterState(harvest)}>
               harvest
            </StyledButton>
         )}
      </div>
   );
};
