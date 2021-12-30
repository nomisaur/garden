/* class State {
  constructor(
    { mutable = {}, immutable = {}, virtual = {}, mutations = {} },
    dependencies = [],
  ) {
    this.mutable = mutable;
    this.immutable = immutable;
    this.virtual = virtual;
    this.dependencies = dependencies;
    this.mutate = Object.entries(mutations).reduce(
      (grow, [key, mutator]) => ({
        ...grow,
        [key]: (...args) => {
          this.mutable = {
            ...this.mutable,
            ...mutator({ ...this.mutable, ...immutable })(...args),
          };
        },
      }),
      {},
    );
  }

  get fields() {
    const fields = { ...this.mutable, ...this.immutable };

    Object.entries(this.virtual).forEach(([key, func]) => {
      Object.defineProperty(fields, key, {
        enumerable: true,
        get: () => func(fields),
      });
    });

    return fields;
  }

  showMutable() {
    return this.mutable;
  }
} */

//const define = (...args) => new State(...args);

const define = ({
   mutable = {},
   immutable = {},
   virtual = {},
   mutations = {},
}) => {
   const state = { current: mutable };

   const getState = () => state.current;

   const fields = () => {
      return { ...state.current, ...immutable };
   };

   const mutate = Object.entries(mutations).reduce(
      (grow, [key, func]) => ({
         ...grow,
         [key]: (...args) => {
            state.current = {
               ...state.current,
               ...func({ ...state.current, ...immutable })(...args),
            };
         },
      }),
      {},
   );

   return {
      getState,
      mutate,
   };
};

const state = define({
   mutable: { count: 1 },
   immutable: { name: 'fun counter' },
   virtual: {
      display: (state) => `display: ${state.name} ${state.count}`,
      negative: (state) => state.count * -1,
   },
   mutations: {
      add: (state) => (num) => ({ count: state.count + num }),
      inc: (state) => () => ({ count: state.count + 1 }),
   },
});

window.state = state;

//////

const pennyPlant = define({
   state: {
      hydration: { value: 5, save: true },
      stage: { value: 0, save: true },
      name: { value: 'Penny Plant' },
   },
   mutations: {
      hydrate: (state) => () => {
         state.hydration = state.hydration + 1;
      },
   },
});

const noop = () => {};

const altPennyPlant = noop`{
  ~ hydration: 5,
  - name: 'Penny Plant',
  ? display: (state) => 
  ! hydrate: (state) => () => {
    state.hydration = state.hydration + 1
  }
}`;

const gameState = define(
   (dependencies) => ({
      state: {
         plants: [],
         count: 0,
      },
      mutations: {
         setPlant: (state) => (index, plant) => {
            state.plants[index] = dependencies[plant]();
         },
         inc: (state) => () => {
            state.count = state.count + 1;
         },
      },
   }),
   { pennyPlant },
)(/* saved data */); // define state, initialize state
gameState.setPlant(0, 'pennyPlant');
gameState.plants[0].hydrate(3); // mutate nested state
gameState(); // get saveable state

// output/input
expectedOutput = {
   plants: {
      value: [
         {
            dependency: 'pennyPlant',
            value: {
               hydration: { value: 8 },
               stage: { value: 0 },
            },
         },
      ],
   },
   count: {
      value: 0,
   },
};

//console.log(counter.fields.display);

/* const define = (data, dependencies = []) => {
  const { mutations } = data;
  const { fields } = data;

  const init = (initialData) => {
    fields = { ...fields, ...initialData };
  };

  const save = () => fields;

  const mutate = Object.entries(mutations).reduce((feed, [key, val]) => {});

  return {
    init,
    save,
    mutate,
  };
}; */

/* const gameState = define({
  fields: { screen: 'garden' },
  mutations: {
    setScreen: () => (screen) => ({ screen }),
  },
});

console.log(gameState.save());

gameState.init({ screen: 'shop' });

console.log(gameState.save());

gameState.mutate.setScreen('home'); */

/* const pennyPlantMaker = define({
  id: 'pennyPlant',
  fields: {
    hydrationLevel: {
      save: true,
      value: 50,
    },
    name: {
      value: 'Penny Plant',
    },
  },
  mutations: {
    water: (state) => ({
      ...state,
      hydrationLevel: state.hydrationLevel + 10,
    }),
  },
});



const pennyPlant = pennyPlantMaker.init({ hydrationLevel: 30 }); */
