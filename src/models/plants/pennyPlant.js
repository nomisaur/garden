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
   plantName: 'penny plant',
   images,
   stages: [{}, {}, {}, {}, {}],
   defaultStage: {
      drops: [{ item: 'plantMatter', amount: 1 }],
      growRate: time({ seconds: 10 }),
      drinkRate: time({ seconds: 3 }),
      dryRate: time({ seconds: 3 }),
      healthyMin: 1,
      healthyMax: 100,
      conversion: [1, 1],
   },
});

window.pennyPlant = pennyPlant;
