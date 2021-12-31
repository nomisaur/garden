import { clone } from './utils';
import { getPlanterState } from './state';
import { soil } from './components/planter/handlers';

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
      timeStamp,
      waterLevel,
      evaporateTimeLeft,
      hydration,
      growTimeLeft,
      drinkTimeLeft,
      dryTimeLeft,
      drinkRate,
      dryRate,
      evaporationRate,
      drinkValue,
      drainValue,
      nextLifeStage,
      nextGrowRate,
      nextDryRate,
      nextDrinkRate,
   } = fullPlanterState;

   if (currentTime < timeAtWhichToUpdatePlanter) {
      return planterState;
   }

   const newState = clone(planterState);

   newState.soil.timeStamp = timeStamp + timePassed;

   if (shouldGrow) {
      newState.soil.plant.lifeStage = nextLifeStage;

      newState.soil.plant.growTimeLeft = nextGrowRate;

      newState.soil.plant.dryTimeLeft = shouldDry
         ? nextDryRate
         : getNewTimer(
              dryTimerActive ? dryTimeLeft - timePassed : dryTimeLeft,
              dryRate,
              nextDryRate,
           );

      newState.soil.plant.drinkTimeLeft = shouldDrink
         ? nextDrinkRate
         : getNewTimer(
              drinkTimerActive ? drinkTimeLeft - timePassed : dryTimeLeft,
              drinkRate,
              nextDrinkRate,
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

export const update = ({ state, fullState, currentTime }) => ({
   ...state,
   planters: state.planters.map((planterState, planterIndex) =>
      getNewPlanterState(
         [planterState, fullState.planters[planterIndex]],
         currentTime,
      ),
   ),
});
