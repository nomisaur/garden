import { time, list } from '../../utils';

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

const lifeStage = ({
  growRate = time({ seconds: 10 }),
  drinkRate = time({ seconds: 3 }),
  dryRate = time({ seconds: 7 }),
  healthyPlantMin = 10,
  healthyPlantMax = 90,
  image = ':)',
}) => ({
  growRate,
  drinkRate,
  dryRate,
  healthyPlantMin,
  healthyPlantMax,
  image,
});

const pennyPlant = {
  value: 1,
  lifeStages: list(5, (n) => lifeStage({ image: images[n] })),
};

export { pennyPlant };
