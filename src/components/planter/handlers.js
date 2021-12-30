import { initialPlantState } from '../../initialState';
import { plantModels, soilModels } from '../../models';

export const plant = ({ state, currentTime }, { planterIndex, type }) => {
   const {
      lifeStages: [{ growRate, drinkRate, dryRate }],
   } = plantModels[type];
   state.planters[planterIndex].soil = {
      ...state.planters[planterIndex].soil,
      timeStamp: currentTime,
      hasPlant: true,
      plant: {
         plantType: type,
         lifeStage: 0,
         hydration: 0,
         growTimeLeft: growRate,
         drinkTimeLeft: drinkRate,
         dryTimeLeft: dryRate,
      },
   };
   return state;
};

export const soil = ({ state, currentTime }, { planterIndex, type }) => {
   const { initialWaterLevel, evaporationRate } = soilModels[type];
   state.planters[planterIndex] = {
      ...state.planters[planterIndex],
      hasSoil: true,
      soil: {
         ...state.planters[planterIndex].soil,
         timeStamp: currentTime,
         soilType: type,
         hasPlant: false,
         waterLevel: initialWaterLevel,
         evaporateTimeLeft: evaporationRate,
      },
   };
   return state;
};

export const water = ({ state, currentTime }, { planterIndex }) => {
   const soilState = state.planters[planterIndex].soil;
   state.planters[planterIndex].soil = {
      ...soilState,
      timeStamp: currentTime,
      waterLevel: Math.min(soilState.waterLevel + 10, 100),
      evaporateTimeLeft: soilModels[soilState.soilType].evaporationRate,
   };
   return state;
};

export const harvest = ({ state, fullState }, { planterIndex }) => {
   const { drops } = fullState.planters[planterIndex];

   drops.forEach(({ item, amount, max }) => {
      const invItem = state.inventory.find(({ item: invItem }) => {
         return invItem === item;
      });
      if (!invItem) {
         state.inventory.push({ item, amount: Math.min(amount, max) });
      } else {
         const { amount: invAmount } = invItem;
         invItem.amount = Math.min(invAmount + amount, max);
      }
   });

   const soil = state.planters[planterIndex].soil;
   soil.hasPlant = false;
   soil.plant = {
      plant: initialPlantState,
   };

   return state;
};
