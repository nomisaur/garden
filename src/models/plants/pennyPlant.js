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
  ageRate = time({ seconds: 3 }),
  drinkRate = time({ seconds: 1 }),
  dryRate = time({ seconds: 2 }),
  healthyMin = 10,
  healthyMax = 90,
  image = ':)',
}) => ({
  ageRate,
  drinkRate,
  dryRate,
  healthyMin,
  healthyMax,
  image,
});

const pennyPlant = {
  value: 1,
  lifeStages: list(5, (n) => lifeStage({ image: images[n] })),
};

export { pennyPlant };
