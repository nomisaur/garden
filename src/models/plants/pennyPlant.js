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
    healthyPlantMin: 1,
    healthyPlantMax: 100,
    conversion: [1, 1],
  },
});
