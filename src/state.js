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
  const { initialWaterLevel, evaporationRate, image: soilImage } = soilType
    ? soilModels[soilType]
    : {};

  // PLANT MODEL
  const { value, lifeStages } = hasPlant ? plantModels[plantType] : {};
  const {
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
    value,
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
