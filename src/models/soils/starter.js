import { time } from '../../utils';

const image = `~~~~~`;

const starter = {
  evaporationRate: time({ seconds: 30 }),
  healthySoilMin: 20,
  healthySoilMax: 80,
  initialWaterLevel: 50,
  image,
};

export { starter };
