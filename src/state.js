import { plantModels, soilModels } from './models';

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
    healthySoilMin,
    healthySoilMax,
    image: soilImage,
  } = soilType ? soilModels[soilType] : {};

  // PLANT MODEL
  const { value, lifeStages } = hasPlant ? plantModels[plantType] : {};
  const {
    growRate,
    drinkRate,
    dryRate,
    conversion: [drinkValue, drainValue] = [],
    healthyPlantMin,
    healthyPlantMax,
    image: plantImage,
  } = hasPlant ? lifeStages[lifeStage] : {};

  // MISC
  const fullyGrown = hasPlant && lifeStage >= lifeStages.length - 1;
  const status =
    hasPlant && hydration < healthyPlantMin
      ? 'dry'
      : hydration > healthyPlantMax
      ? 'wet'
      : 'healthy';

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
    healthySoilMin,
    healthyPlantMax,
    soilImage,

    // PLANT MODEL
    value,
    lifeStages,
    growRate,
    drinkRate,
    dryRate,
    drinkValue,
    drainValue,
    healthyPlantMin,
    healthySoilMax,
    plantImage,

    // MISC
    fullyGrown,
    status,
  };
};
