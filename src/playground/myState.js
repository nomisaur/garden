import { plant } from '../components/planter/handlers';
import { time } from '../utils';

const myState = {
   screen: 'garden',
   planters: [
      {
         hasSoil: true,
         soil: {
            timeStamp: 1627785113510,
            soilType: 'starter',
            hasPlant: true,
            waterLevel: 78,
            evaporateTimeLeft: 24000,
            plant: {
               plantType: 'pennyPlant',
               lifeStage: 0,
               hydration: 2,
               growTimeLeft: 7000,
               drinkTimeLeft: 3000,
               dryTimeLeft: 3000,
               // immutable:
               plantName: 'penny plant',
               lifeStages: [
                  {
                     drops: [
                        {
                           item: 'plantMatter',
                           amount: 1,
                        },
                     ],
                     growRate: 10000,
                     drinkRate: 3000,
                     dryRate: 3000,
                     healthyMin: 1,
                     healthyMax: 100,
                     conversion: [1, 1],
                     image: '     \n     \n     \n  .  \n',
                  },
                  {
                     drops: [
                        {
                           item: 'plantMatter',
                           amount: 1,
                        },
                     ],
                     growRate: 10000,
                     drinkRate: 3000,
                     dryRate: 3000,
                     healthyMin: 1,
                     healthyMax: 100,
                     conversion: [1, 1],
                     image: '     \n     \n     \n  :  \n',
                  },
                  {
                     drops: [
                        {
                           item: 'plantMatter',
                           amount: 1,
                        },
                     ],
                     growRate: 10000,
                     drinkRate: 3000,
                     dryRate: 3000,
                     healthyMin: 1,
                     healthyMax: 100,
                     conversion: [1, 1],
                     image: '     \n     \n  *  \n  :  \n',
                  },
                  {
                     drops: [
                        {
                           item: 'plantMatter',
                           amount: 1,
                        },
                     ],
                     growRate: 10000,
                     drinkRate: 3000,
                     dryRate: 3000,
                     healthyMin: 1,
                     healthyMax: 100,
                     conversion: [1, 1],
                     image: '     \n  *  \n  |  \n  :  \n',
                  },
                  {
                     drops: [
                        {
                           item: 'plantMatter',
                           amount: 1,
                        },
                     ],
                     growRate: 10000,
                     drinkRate: 3000,
                     dryRate: 3000,
                     healthyMin: 1,
                     healthyMax: 100,
                     conversion: [1, 1],
                     image: '  *  \n ~+~ \n  |  \n  :  \n',
                  },
               ],
            },
         },
      },
      {
         hasSoil: false,
         soil: {
            timeStamp: null,
            soilType: null,
            hasPlant: false,
            waterLevel: null,
            evaporateTimeLeft: null,
            plant: {
               plantType: null,
               lifeStage: null,
               hydration: null,
               growTimeLeft: null,
               drinkTimeLeft: null,
               dryTimeLeft: null,
            },
         },
      },
   ],
   inventory: [],
};

const define = () => {
   return () => {};
};

const pennyPlant = define(() => ({
   mutable: {
      lifeStage: 0,
      hydration: 0,
      growTimeLeft: 10000,
      drinkTimeLeft: 3000,
      dryTimeLeft: 3000,
   },
   immutable: {
      plantType: 'pennyPlant',
      plantName: 'penny plant',
      lifeStages: [
         {
            drops: [
               {
                  item: 'plantMatter',
                  amount: 1,
               },
            ],
            growRate: 10000,
            drinkRate: 3000,
            dryRate: 3000,
            healthyMin: 1,
            healthyMax: 100,
            conversion: [1, 1],
            image: '     \n     \n     \n  .  \n',
         },
         {
            drops: [
               {
                  item: 'plantMatter',
                  amount: 1,
               },
            ],
            growRate: 10000,
            drinkRate: 3000,
            dryRate: 3000,
            healthyMin: 1,
            healthyMax: 100,
            conversion: [1, 1],
            image: '     \n     \n     \n  :  \n',
         },
         {
            drops: [
               {
                  item: 'plantMatter',
                  amount: 1,
               },
            ],
            growRate: 10000,
            drinkRate: 3000,
            dryRate: 3000,
            healthyMin: 1,
            healthyMax: 100,
            conversion: [1, 1],
            image: '     \n     \n  *  \n  :  \n',
         },
         {
            drops: [
               {
                  item: 'plantMatter',
                  amount: 1,
               },
            ],
            growRate: 10000,
            drinkRate: 3000,
            dryRate: 3000,
            healthyMin: 1,
            healthyMax: 100,
            conversion: [1, 1],
            image: '     \n  *  \n  |  \n  :  \n',
         },
         {
            drops: [
               {
                  item: 'plantMatter',
                  amount: 1,
               },
            ],
            growRate: 10000,
            drinkRate: 3000,
            dryRate: 3000,
            healthyMin: 1,
            healthyMax: 100,
            conversion: [1, 1],
            image: '  *  \n ~+~ \n  |  \n  :  \n',
         },
      ],
   },
   virtual: {
      fullyGrown: ({ lifeStage, lifeStages }) =>
         lifeStage >= lifeStages.length - 1,
      status: ({ hydration, healthyMin, healthyMax }) =>
         hydration < healthyMin
            ? 'dry'
            : hydration > healthyMax
            ? 'wet'
            : 'healthy',
      isDry: ({ hydration, healthyMin }) => hydration < healthyMin,
      isWet: ({ hydration, healthyMax }) => hydration > healthyMax,
      isHealthy: ({ hydration, healthyMin }) =>
         healthyMin <= hydration && hydration <= healthyMax,
      currentStage: ({ lifeStage, lifeStages }) => lifeStages[lifeStage],
   },
   mutations: {},
}));

const starterSoil = define(
   (dependencies) => ({
      mutable: {
         timeStamp: null,
         hasPlant: false,
         waterLevel: 50,
         evaporateTimeLeft: time({ seconds: 30 }),
         plant: null,
      },
      immutable: {
         soilType: 'starter',
         evaporationRate: time({ seconds: 30 }),
         image: `~~~~~`,
         emptyPlant: '    \n    \n    \n    \n',
      },
      mutations: {
         setPlant:
            (state) =>
            ({ plantName, currentTime }) => {
               state.hasPlant = true;
               state.timeStamp = currentTime;
               state.plant = dependencies[plantName]();
            },
         water:
            (state) =>
            ({ currentTime }) => {
               state.timeStamp = currentTime;
               state.waterLevel = Math.min(state.waterLevel + 10, 100);
               state.evaporateTimeLeft = state.evaporationRate;
            },
      },
   }),
   { pennyPlant },
);

export const harvest = (state, { planterIndex }) => {
   const { drops } = getPlanterState(state.planters[planterIndex]);

   drops.forEach(({ item, amount, max }) => {
      console.log(item);
      const invItem = state.inventory.find(({ item: invItem }) => {
         console.log(invItem, item);
         return invItem === item;
      });
      if (!invItem) {
         state.inventory.push({ item, amount: Math.min(amount, max) });
      } else {
         const { amount: invAmount } = getItemState(invItem);
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

const planter = define(
   (soils) => ({
      mutatable: {
         hasSoil: false,
         soil: null,
      },
      mutations: {
         setSoil:
            (state) =>
            ({ type, currentTime }) => {
               state.hasSoil = true;
               state.soil = soils[type]({ timeStamp: currentTime });
            },
      },
   }),
   { starterSoil },
);

const gameState = define(
   ({ planter }) => ({
      mutable: {
         screen: 'garden',
         planters: [planter(), planter(), planter(), planter()],
         inventory: [],
      },
   }),
   { planter },
)();
