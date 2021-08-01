import { plantModels, soilModels, itemModels } from './models';

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
      healthyMin,
      healthyMax,
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
   };
};

export const getState = (state) => {
   const { screen, planters, inventory } = state;
   return {
      screen,
      planters: planters.map(getPlanterState),
      inventory: inventory.map(getItemState),
   };
};
