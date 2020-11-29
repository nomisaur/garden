import { time } from '../utils/pureUtils';

const phase = {
  duration: time({ seconds: 3 }),
  waterLevels: [
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
  ],
};

const popper = {
  value: 1,
  initialWaterLevel: 1,
  phases: [
    {
      ...phase,
      image: `



~~.~~
`,
    },
    {
      ...phase,
      image: `
    
    
    
~~^~~
`,
    },
    {
      ...phase,
      image: `
 
 
  *  
~~^~~
`,
    },
    {
      ...phase,
      image: `
 
  *
  |
~~^~~
`,
    },
    {
      ...phase,
      image: `
  *
 ~+~
  |
~~^~~
`,
    },
  ],
};

export const plants = { popper };
