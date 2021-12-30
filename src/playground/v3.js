const define = () => {
   return {
      init: () => {},
      read: () => {},
   };
};

const idealGameState = {
   harvested: 2,
   plants: [
      {
         name: 'Penny Plant',
         value: 1,
         lifeStage: 2,
         timeStamp: 1234,
      },
      {
         name: 'Dollar Plant',
         value: 100,
         lifeStage: 1,
         timeStamp: 2345,
      },
   ],
};

const definePlant = ({ id, name, value }) => {
   return define(
      {
         lifeStage: 0,
         timeStamp: 0,
      },
      {
         id,
         model: {
            name,
            value,
         },
         mutations: {
            grow: (state) => () => {
               state.lifeStage = state.lifeStage + 1;
            },
         },
      },
   );
};

const plants = {
   pennyPlant: definePlant({ id: 'pennyPlant', name: 'Penny Plant', value: 1 }),
   dollarPlant: definePlant({
      id: 'dollarPlant',
      name: 'Dollar Plant',
      value: 100,
   }),
};

const gameState = define(
   {
      harvested: 0,
      plants: [
         plants.pennyPlant.init({ timeStamp: Date.now() }),
         null,
         null,
         null,
      ],
   },
   {
      id: 'gameState',
      dependencies: { ...plants },
      mutations: {
         addPlant: (state) => (index, plantName) => {
            if (!state.plants[index]) {
               state.plants[index] = plants[plantName].init({
                  timeStamp: Date.now(),
               });
            }
         },
         harvest: (state) => (index) => {
            state.harvested = state.plants[index].value;
            state.plants[index] = null;
         },
      },
   },
).read({
   id: 'gameState',
   value: {
      harvested: {
         leaf: true,
         value: 3,
      },
      plants: {
         value: [
            {
               id: 'pennyPlant',
               value: {
                  lifeStage: {
                     leaf: true,
                     value: 2,
                  },
                  timeStamp: {
                     leaf: true,
                     value: 1234,
                  },
               },
            },
            {
               id: 'dollarPlant',
               value: {
                  lifeStage: {
                     leaf: true,
                     value: 1,
                  },
                  timeStamp: {
                     leaf: true,
                     value: 2345,
                  },
               },
            },
         ],
      },
   },
});
