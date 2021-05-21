import { time } from '../../utils';

const image = `~~~~~`;

const starter = {
  evaporationRate: time({ seconds: 5 }),
  healthyMin: 20,
  healthyMax: 80,
  initialWaterLevel: 50,
  image,
};

export { starter };
