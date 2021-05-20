import { time } from '../../utils';

const images = [
  `
     
     
     
~~.~~
`,
  `
     
     
     
~~^~~
`,
  `
     
     
  *  
~~^~~
`,
  `
     
  *  
  |  
~~^~~
`,
  `
  *  
 ~+~ 
  |  
~~^~~
`,
];

const phase = {
  duration: time({ seconds: 3 }),
  drinkRate: time({ seconds: 1 }),
  healthyMin: 10,
  healthyMax: 90,
  /* waterLevels: [
    {
      status: 'dry',
      healthy: false,
      dry: true,
      wet: false,
      duration: time({ seconds: 5 }),
    },
    {
      status: 'healthy',
      healthy: true,
      dry: false,
      wet: false,
      duration: time({ seconds: 5 }),
    },
    {
      status: 'wet',
      healthy: false,
      dry: false,
      wet: true,
      duration: time({ seconds: 5 }),
    },
  ], */
};

const pennyPlant = {
  value: 1,
  lifeStages: [
    {
      duration: time({ seconds: 3 }),
      drinkRate: time({ seconds: 1 }),
      healthyMin: 10,
      healthyMax: 90,
      image: images[0],
    },
    {
      duration: time({ seconds: 3 }),
      drinkRate: time({ seconds: 1 }),
      healthyMin: 10,
      healthyMax: 90,
      image: images[1],
    },
    {
      duration: time({ seconds: 3 }),
      drinkRate: time({ seconds: 1 }),
      healthyMin: 10,
      healthyMax: 90,
      image: images[2],
    },
    {
      duration: time({ seconds: 3 }),
      drinkRate: time({ seconds: 1 }),
      healthyMin: 10,
      healthyMax: 90,
      image: images[3],
    },
    {
      duration: time({ seconds: 3 }),
      drinkRate: time({ seconds: 1 }),
      healthyMin: 10,
      healthyMax: 90,
      image: images[4],
    },
  ],
};

export { pennyPlant };
