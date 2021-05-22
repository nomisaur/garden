import { time } from '../../utils';
import { definePlant } from './utils';

const images = [
  `     
     
     
  .  
`,
  `     
     
     
  :  
`,
  `     
     
  *  
  :  
`,
  `     
  *  
  |  
  :  
`,
  `  *  
 ~+~ 
  |  
  :  
`,
];

export const pennyPlant = definePlant({
  value: 1,
  images,
  stages: [{}, {}, {}, {}, {}],
  defaultStage: {
    growRate: time({ seconds: 10 }),
    drinkRate: time({ seconds: 3 }),
    dryRate: time({ seconds: 3 }),
    healthyMin: 1,
    healthyMax: 100,
    conversion: [1, 1],
  },
});
