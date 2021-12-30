import { clone } from './utils';
import { getPlanterState } from './state';

const getNewTimer = (timeLeft, oldTimer, newTimer) =>
   Math.round(newTimer * (timeLeft / oldTimer));

const getNewPlanterState = ([planterState, fullPlanterState], currentTime) => {
   const {
      evaporateTimerActive,
      drinkTimerActive,
      dryTimerActive,
      growTimerActive,
      shouldEvaporate,
      shouldDrink,
      shouldDry,
      shouldGrow,
      timeAtWhichToUpdatePlanter,
      tickTime: timePassed,
   } = fullPlanterState;

   if (currentTime < timeAtWhichToUpdatePlanter) {
      return planterState;
   }

   const {
      timeStamp,
      waterLevel,
      evaporateTimeLeft,
      lifeStage,
      hydration,
      growTimeLeft,
      drinkTimeLeft,
      dryTimeLeft,
      drinkRate,
      dryRate,
      lifeStages,
      evaporationRate,
      drinkValue,
      drainValue,
   } = fullPlanterState;

   const newState = clone(planterState);

   newState.soil.timeStamp = timeStamp + timePassed;

   if (shouldGrow) {
      const newLifeStage = Math.min(lifeStage + 1, lifeStages.length - 1);

      const {
         growRate: newGrowRate,
         dryRate: newDryRate,
         drinkRate: newDrinkRate,
      } = lifeStages[newLifeStage];

      newState.soil.plant.lifeStage = newLifeStage;

      newState.soil.plant.growTimeLeft = newGrowRate;

      newState.soil.plant.dryTimeLeft = shouldDry
         ? newDryRate
         : getNewTimer(
              dryTimerActive ? dryTimeLeft - timePassed : dryTimeLeft,
              dryRate,
              newDryRate,
           );

      newState.soil.plant.drinkTimeLeft = shouldDrink
         ? newDrinkRate
         : getNewTimer(
              drinkTimerActive ? drinkTimeLeft - timePassed : dryTimeLeft,
              drinkRate,
              newDrinkRate,
           );

      newState.soil.evaporateTimeLeft = shouldEvaporate
         ? evaporationRate
         : evaporateTimerActive
         ? evaporateTimeLeft - timePassed
         : evaporateTimeLeft;
   } else {
      if (growTimerActive) {
         newState.soil.plant.growTimeLeft = growTimeLeft - timePassed;
      }
      if (drinkTimerActive) {
         newState.soil.plant.drinkTimeLeft = shouldDrink
            ? drinkRate
            : drinkTimeLeft - timePassed;
      }
      if (dryTimerActive) {
         newState.soil.plant.dryTimeLeft = shouldDry
            ? dryRate
            : dryTimeLeft - timePassed;
      }
      if (evaporateTimerActive) {
         newState.soil.evaporateTimeLeft = shouldEvaporate
            ? evaporationRate
            : evaporateTimeLeft - timePassed;
      }
   }

   if (shouldDrink) {
      newState.soil.plant.hydration = Math.min(hydration + drinkValue, 100);
      newState.soil.waterLevel = Math.max(waterLevel - drainValue, 0);
   }

   if (shouldDry) {
      newState.soil.plant.hydration = Math.max(
         newState.soil.plant.hydration - 1,
         0,
      );
   }

   if (shouldEvaporate) {
      newState.soil.waterLevel = Math.max(newState.soil.waterLevel - 1, 0);
   }

   return getNewPlanterState(
      [newState, getPlanterState(newState)],
      currentTime,
   );
};

export const update = ({ state, fullState, currentTime }) => {
   return {
      ...state,
      planters: state.planters.map((planterState, planterIndex) =>
         getNewPlanterState(
            [planterState, fullState.planters[planterIndex]],
            currentTime,
         ),
      ),
   };
};
