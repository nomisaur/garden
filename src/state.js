import { plantModels, soilModels } from './models';

export const getPlanterState = (planterState) => {
  // STATE
  const {
    hasSoil,
    soil: {
      timeStamp,
      soilType,
      hasPlant,
      waterLevel,
      evaporateTimeLeft,
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
    evaporationRate,
    healthySoilMin,
    healthySoilMax,
    initialWaterLevel,
    image: soilImage,
  } = soilType ? soilModels[soilType] : {};

  // PLANT MODEL
  const { value, lifeStages } = hasPlant ? plantModels[plantType] : {};
  const {
    growRate,
    drinkRate,
    dryRate,
    healthyPlantMin,
    healthyPlantMax,
    image: plantImage,
    conversion: [drinkValue, drainValue] = [],
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
    hasSoil,
    timeStamp,
    soilType,
    hasPlant,
    waterLevel,
    evaporateTimeLeft,
    plantType,
    lifeStage,
    hydration,
    growTimeLeft,
    drinkTimeLeft,
    dryTimeLeft,
    evaporationRate,
    healthySoilMin,
    healthyPlantMax,
    initialWaterLevel,
    soilImage,
    growRate,
    drinkRate,
    dryRate,
    healthyPlantMin,
    healthySoilMax,
    drinkValue,
    drainValue,
    plantImage,
    value,
    lifeStages,
    fullyGrown,
    status,
  };
};
