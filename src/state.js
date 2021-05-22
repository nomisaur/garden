import { plantModels, soilModels } from './models';

export const getSoilState = (soilState) => {
  const {
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
  } = soilState;

  const {
    evaporationRate,
    healthySoilMin,
    healthySoilMax,
    initialWaterLevel,
    image: soilImage,
  } = soilType ? soilModels[soilType] : {};

  const { value, lifeStages } = hasPlant ? plantModels[plantType] : {};

  const {
    growRate,
    drinkRate,
    dryRate,
    healthyPlantMin,
    healthyPlantMax,
    image: plantImage,
  } = hasPlant ? lifeStages[lifeStage] : {};

  const fullyGrown = hasPlant && lifeStage >= lifeStages.length - 1;
  const status =
    hasPlant && hydration < healthyPlantMin
      ? 'dry'
      : hydration > healthyPlantMax
      ? 'wet'
      : 'healthy';

  return {
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
    plantImage,
    value,
    lifeStages,
    fullyGrown,
    status,
  };
};

export const getPlanterState = (planterState) => {
  const { hasSoil, soil } = planterState;
  return {
    hasSoil,
    ...getSoilState(soil),
  };
};
