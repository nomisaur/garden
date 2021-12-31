import { plantModels, soilModels, itemModels } from './models';
import { includeIf } from './utils';

export const getItemState = (inventoryState) => {
   // STATE
   const { item, amount } = inventoryState;

   // MODEL
   const { name, value, max } = itemModels[item];

   return {
      // STATE
      item,
      amount,

      // MODEL
      name,
      value,
      max,
   };
};

export const getPlanterState = (planterState) => {
   // STATE
   const {
      hasSoil,
      soil: {
         timeStamp,
         soilType,
         waterLevel,
         evaporateTimeLeft,
         hasPlant,
         plant: {
            plantType,
            lifeStage,
            hydration,
            growTimeLeft,
            drinkTimeLeft,
            dryTimeLeft,
         },
      },
   } = planterState;

   // SOIL MODEL
   const {
      initialWaterLevel,
      evaporationRate,
      image: soilImage,
   } = soilType ? soilModels[soilType] : {};

   // PLANT MODEL
   const { plantName, lifeStages } = hasPlant ? plantModels[plantType] : {};
   const {
      drops = [],
      growRate,
      drinkRate,
      dryRate,
      conversion: [drinkValue, drainValue] = [],
      plantRange: [healthyMin, healthyMax] = [],
      soilRange: [waterMin, waterMax] = [],
      image: plantImage,
   } = hasPlant ? lifeStages[lifeStage] : {};

   // MISC
   const fullyGrown = hasPlant && lifeStage >= lifeStages.length - 1;
   const status =
      hasPlant && hydration < healthyMin
         ? 'dry'
         : hydration > healthyMax
         ? 'wet'
         : 'healthy';
   const isDry = status === 'dry';
   const isHealthy = status === 'healthy';
   const isWet = status === 'wet';
   const soilStatus =
      hasPlant && waterLevel < waterMin
         ? 'dry'
         : waterLevel > waterMax
         ? 'wet'
         : 'comfy';
   const isSoilDry = soilStatus === 'dry';
   const isSoilComfy = soilStatus === 'comfy';
   const isSoilWet = soilStatus === 'wet';

   // UPDATE DATA
   const evaporateTimerActive = hasSoil && waterLevel > 0;
   const drinkTimerActive =
      hasPlant && hydration < 100 && waterLevel >= drainValue;
   const dryTimerActive = hasPlant && hydration > 0 && waterLevel === 0;
   const growTimerActive = hasPlant && !fullyGrown && isHealthy && isSoilComfy;
   const tickTime = Math.min(
      ...[
         ...includeIf(evaporateTimerActive, evaporateTimeLeft),
         ...includeIf(drinkTimerActive, drinkTimeLeft),
         ...includeIf(dryTimerActive, dryTimeLeft),
         ...includeIf(growTimerActive, growTimeLeft),
      ],
   );
   const timeAtWhichToUpdatePlanter = tickTime + timeStamp;
   const shouldEvaporate =
      evaporateTimerActive && evaporateTimeLeft === tickTime;
   const shouldDrink = drinkTimerActive && drinkTimeLeft === tickTime;
   const shouldDry = dryTimerActive && dryTimeLeft === tickTime;
   const shouldGrow = growTimerActive && growTimeLeft === tickTime;

   return {
      // STATE
      timeStamp,
      hasSoil,
      soilType,
      waterLevel,
      evaporateTimeLeft,
      hasPlant,
      plantType,
      lifeStage,
      hydration,
      growTimeLeft,
      drinkTimeLeft,
      dryTimeLeft,

      // SOIL MODEL
      initialWaterLevel,
      evaporationRate,
      soilImage,

      // PLANT MODEL
      plantName,
      drops: drops.map(getItemState),
      lifeStages,
      growRate,
      drinkRate,
      dryRate,
      drinkValue,
      drainValue,
      healthyMin,
      healthyMax,
      plantImage,

      // MISC
      fullyGrown,
      status,
      isDry,
      isWet,
      isHealthy,
      soilStatus,
      isSoilDry,
      isSoilComfy,
      isSoilWet,

      // UPDATE DATA
      evaporateTimerActive,
      drinkTimerActive,
      dryTimerActive,
      growTimerActive,
      tickTime,
      shouldEvaporate,
      shouldDrink,
      shouldDry,
      shouldGrow,
      timeAtWhichToUpdatePlanter,
   };
};

export const getState = (state) => {
   const { screen, planters, inventory } = state;
   const fullPlanterStates = planters.map(getPlanterState);
   const timeAtWhichToUpdate = fullPlanterStates.reduce(
      (timeAtWhichToUpdate, { timeAtWhichToUpdatePlanter }) =>
         Math.min(timeAtWhichToUpdate, timeAtWhichToUpdatePlanter),
      Infinity,
   );
   return {
      screen,
      timeAtWhichToUpdate,
      planters: fullPlanterStates,
      inventory: inventory.map(getItemState),
   };
};
