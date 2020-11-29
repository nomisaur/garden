import { plants } from '../plants';

const shouldUpdateLevels = (plantState, currentTime) => {
  const {
    timeStamp,
    type,
    phase,
    phaseTimeLeft,
    waterLevel,
    waterTimeLeft,
  } = plantState;

  const { phases } = plants[type];
  const { waterLevels } = phases[phase];
  const { status } = waterLevels[waterLevel];

  const fullyGrown = phase === phases.length - 1;
  const fullyDry = waterLevel === 0;

  const timePassed = currentTime - timeStamp;

  const phaseBeep =
    !fullyGrown && status === 'healthy' && phaseTimeLeft < timePassed;
  const waterBeep = !fullyDry && waterTimeLeft < timePassed;

  return { phaseBeep, waterBeep };
};

export { shouldUpdateLevels };
