import { plantModels } from './index';

const shouldUpdateLevels = (plantState, currentTime) => {
  const {
    timeStamp,
    type,
    phase,
    phaseTimeLeft,
    waterLevel,
    waterTimeLeft,
  } = plantState;

  const { phases } = plantModels[type];
  const { status } = phases[phase].waterLevels[waterLevel];

  const fullyGrown = phase === phases.length - 1;
  const fullyDry = waterLevel === 0;

  const timePassed = currentTime - timeStamp;

  const shouldUpdatePhase =
    !fullyGrown && status === 'healthy' && phaseTimeLeft < timePassed;

  const shouldUpdateWater = !fullyDry && waterTimeLeft < timePassed;

  return { shouldUpdatePhase, shouldUpdateWater };
};

export { shouldUpdateLevels };
