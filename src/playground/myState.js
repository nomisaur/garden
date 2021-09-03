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

const saveDataIdeal = {
   screen: {
      leaf: true,
      value: 'garden',
   },
   planters: {
      leaf: false,
      value: [
         {
            leaf: false,
            id: 'planter',
            value: {},
         },
      ],
   },
};

const commonReducer = (target, func) => {
   return Array.isArray(target)
      ? target.reduce((grow, item, index) => func(grow, index, item), [])
      : Object.entries(target).reduce(
           (grow, [prop, item]) => func(grow, prop, item),
           {},
        );
};

const recursiveReduce = (saveData, dependencies) => {
   return commonReducer(saveData, (grow, key, { leaf, value, id }) => ({
      ...grow,
      ...(leaf
         ? { [key]: value }
         : id
         ? dependencies[id](value)
         : recursiveReduce(value, dependencies)),
   }));
};

/* const recursiveExpand = (saveData) => {
   return commonReducer(saveData, (grow, ))
}; */

const define = (id, func, dependencies = {}) => {
   const {
      mutable = {},
      immutable = {},
      virtual = {},
      mutations = {},
   } = func(dependencies);
   return ({ id, value } = {}) => {
      const state = {
         current: {
            ...mutable,
            //...recursiveReduce(initialData.value, dependencies),
         },
      };

      const showSaveableState = () => {
         return { id, value: state };
      };

      return showSaveableState;
   };
};

const pennyPlant = define('pennyPlant', () => ({
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
   'starterSoil',
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

const planter = define(
   'planter',
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
   'gameState',
   ({ planter }) => ({
      mutable: {
         screen: 'garden',
         planters: [planter(), planter(), planter(), planter()],
         inventory: [],
      },
   }),
   { planter },
)({
   id: 'gameState',
   value: {
      screen: {
         leaf: true,
         value: 'shop',
      },
      planters: {
         value: [
            {
               id: 'planter',
               value: {},
            },
            {
               id: 'planter',
               value: {},
            },
            {
               id: 'planter',
               value: {},
            },
            {
               id: 'planter',
               value: {},
            },
         ],
      },
   },
});

window.state = gameState;
