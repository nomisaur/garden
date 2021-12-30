import React, { useEffect } from 'react';
import { useAppContext } from '../../hooks';
import { getPlanterState } from '../../state';
import { soilModels, plantModels, planterImage } from '../../models';
import { shouldUpdate, plant, soil, harvest, update, water } from './handlers';

import { StyledImage, StyledButton } from '../styled';

const currentTime = () => Date.now();

export const Planter = ({ planterState, planterIndex }) => {
   const { handleState } = useAppContext();

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
               onClick={() =>
                  handleState(soil, {
                     planterIndex,
                     currentTime: currentTime(),
                     type: 'starter',
                  })
               }
            >
               add soil
            </StyledButton>
         )}
         {hasSoil && (
            <StyledButton
               onClick={() =>
                  handleState(water, {
                     planterIndex,
                  })
               }
            >
               water
            </StyledButton>
         )}
         {hasSoil && !hasPlant && (
            <StyledButton
               onClick={() =>
                  handleState(plant, {
                     planterIndex,
                     type: 'pennyPlant',
                  })
               }
            >
               add plant
            </StyledButton>
         )}
         {hasPlant && (
            <StyledButton
               onClick={() =>
                  handleState(harvest, {
                     planterIndex,
                  })
               }
            >
               harvest
            </StyledButton>
         )}
      </div>
   );
};
