/* const planters = () => {
   return {
      mutations: {},
      json: {},
      type: 'plants',
   };
};
planters.water = 0;
planters.love = 2;

const state = () => {
   return {
      mutations: {},
      json: {},
      type: 'game',
   };
};
state.prop1 = 1;
state.prop2 = 2;
state.planters = planters; */

/* const state = {
   a: 1,
   b: 2,
};

state.__proto__ = {
   mutations: {},
   json: {},
   type: '',
}; */

//window.state = state;

const data = {
   type: 'restate',
   model: 'gamestate',
   props: {
      screen: {
         type: 'primitive',
         value: 'garden',
      },
      planters: {
         type: 'array',
         value: [
            {
               type: 'restate',
               model: 'soil',
               props: { name: { type: 'primitive', value: 'penny plant' } },
            },
         ],
      },
      inventory: {
         type: 'array',
         value: [],
      },
   },
};

const plantModel = (type) => ({
   name: 'plantModel',
   props: {
      plantType: type,
      lifeStage: 0,
      hydration: 0,
      growTimeLeft: plants[type].lifeStages[0].growRate,
      drinkTimeLeft: plants[type].lifeStages[0].drinkRate,
      dryTimeLeft: plants[type].lifeStages[0].dryRate,
   },
   virtual: {
      plantName: (state) => plants[state.plantType].name,
      lifeStages: (state) => plants[state.plantType].lifeStages,
      currentStage: (state) =>
         plants[state.plantType].lifeStages[state.lifeStage],
   },
});

const soilModel = {
   name: 'soilModel',
   props: {
      timeStamp: null,
      soilType: null,
      hasPlant: false,
      waterLevel: null,
      evaporateTimeLeft: null,
      plant: {},
   },
   virtual: {
      evaporationRate: (state) => soils[state.soilType].evaporationRate,
      initialWaterLevel: (state) => soils[state.soilType].initialWaterLevel,
      image: (state) => soils[state.soilType].image,
   },
   mutations: {
      plant: (state) => (currentTime, type) => {
         if (hasPlant) {
            return state;
         }
         return {
            ...state,
            hasPlant: true,
            timeStamp: currentTime,
            plant: restate(plantModel).init(type),
         };
      },
      water: (state) => (currentTime) => ({
         ...state,
         timeStamp: currentTime,
         waterLevel: Math.min(state.waterLevel + 10, 100),
         evaporateTimeLeft: soils[state.soilType].evaporationRate,
      }),
   },
   models: { plantModel },
};

const setProp = (obj, prop, value) => {
   Object.defineProperty(obj, prop, {
      writable: false,
      configurable: true,
      value,
   });
   return value;
};

class Restate {
   constructor({ model, args, data }) {
      //console.log(this, typeof this, this instanceof Restate);
      setProp(this, 'd', 0);
   }
   inc() {
      return setProp(this, 'd', this.d + 1);
   }
}

const restate = (model) => ({
   init: (...args) => new Restate({ model, args }),
   hydrate: (data) => new Restate({ model, data }),
});

window.state = new Restate();
