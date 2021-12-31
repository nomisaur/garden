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
   stages: [
      {
         growRate: time({ seconds: 2 }),
         drinkRate: time({ seconds: 1 }),
      },
      { healthyMin: 3 },
      {},
      {},
      {},
   ],
   defaultStage: {
      drops: [{ item: 'plantMatter', amount: 1 }],
      growRate: time({ seconds: 3 }),
      drinkRate: time({ seconds: 3 }),
      dryRate: time({ seconds: 3 }),
      plantRange: [1, 100],
      soilRange: [30, 70],
      conversion: [1, 5],
   },
});

window.pennyPlant = pennyPlant;
