import _clone from 'rfdc';

const clone = _clone();

const noop = () => {};

const commonReducer = (target, func) => {
   return Array.isArray(target)
      ? target.reduce((grow, item, index) => func(grow, index, item), [])
      : Object.entries(target).reduce(
           (grow, [prop, item]) => func(grow, prop, item),
           {},
        );
};

const commonForEach = (target, func) => {
   return Array.isArray(target)
      ? target.forEach((val, key) => {
           func(key, val);
        })
      : Object.entries(target).forEach(([key, val]) => {
           func(key, val);
        });
};

export const $signature = Symbol('~');
export const $signedState = Symbol('~');
export const $mutate = Symbol('~');
export const $empty = Symbol('empty');

export const sign = (obj) => {
   Object.defineProperty(obj, $signature, {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false,
   });
   return obj;
};

export const makeState = ({
   getState = noop,
   getProps = noop,
   mutate = noop,
   getSignedState = noop,
   getChildren = noop,
}) => {
   const state = {
      ...getChildren(),
      state: getState,
      props: getProps,
   };
   Object.defineProperty(state, $signedState, {
      value: getSignedState,
      configurable: false,
      enumerable: false,
      writable: false,
   });
   Object.defineProperty(state, $mutate, {
      value: mutate,
      configurable: false,
      enumerable: false,
      writable: false,
   });
   sign(state);
   return state;
};

export const mut = (init) => {
   const state = { current: init };
   const getState = () => {
      if (state.current && state.current[$signature]) {
         return state.current.state();
      } else {
         return state.current;
      }
   };
   const getSignedState = () => {
      if (state.current && state.current[$signature]) {
         return state.current[$signedState]();
      } else {
         return state.current;
      }
   };
   const getProps = () => {
      if (state.current && state.current[$signature]) {
         return state.current.props();
      } else {
         return state.current;
      }
   };
   const mutate = (editFunction) => {
      if (state.current && state.current[$signature]) {
         state.current[$mutate](editFunction);
      } else {
         state.current = editFunction();
      }
   };
   const getChildren = () => {
      return state.current;
   };
   return makeState({
      getState,
      getSignedState,
      getProps,
      mutate,
      getChildren,
   });
};

export const imm = (init) => {
   const getState = () => {
      if (init && init[$signature]) {
         return init.state();
      } else {
         return $empty;
      }
   };
   const getSignedState = () => {
      if (init && init[$signature]) {
         return init[$signedState]();
      } else {
         return $empty;
      }
   };
   const getProps = () => {
      if (init && init[$signature]) {
         return init.props();
      } else {
         return init;
      }
   };
   const mutate = (editFunction) => {
      if (init && init[$signature]) {
         init[$mutate](editFunction);
      }
   };
   const getChildren = () => {
      return init;
   };
   return makeState({
      getState,
      getSignedState,
      getProps,
      mutate,
      getSignedState,
      getChildren,
   });
};

export const node = (init) => {
   const state = { current: init };
   const getState = () => {
      return commonReducer(state.current, (grow, key, val) => {
         const childState = val.state();
         if (childState !== $empty) {
            grow[key] = childState;
         }
         return grow;
      });
   };
   const getSignedState = () => {
      return sign(
         Object.assign(
            {},
            commonReducer(state.current, (grow, key, val) => {
               const childState = val[$signedState]();
               if (childState !== $empty) {
                  grow[key] = childState;
               }
               return grow;
            }),
         ),
      );
   };
   const getProps = () => {
      return commonReducer(state.current, (grow, key, val) => {
         const childProps = val.props();
         if (childProps !== $empty) {
            grow[key] = childProps;
         }
         return grow;
      });
   };

   const mutate = (editFunction = noop) => {
      const newState = editFunction(getSignedState());
      commonForEach(getState(), (key) => {
         if (newState && newState.hasOwnProperty(key)) {
            const newSubState = newState[key];
            if (newSubState[$signature]) {
               state.current[key][$mutate](() => {
                  return newSubState;
               });
            } else {
               state.current[key] = mut(newSubState);
            }
         } else {
            delete state.current[key];
         }
      });
   };
   const getChildren = () => {
      return state.current;
   };
   return makeState({
      getState,
      getProps,
      mutate,
      getSignedState,
      getChildren,
   });
};

const createState = (state, getMutations = () => ({})) => {
   state.mutate = getMutations(state[$mutate]);
   return state;
};

const transform = (mutate) => (fn) => {
   return (...ags) => mutate((state) => fn(state)(...args));
};

const parse = (template, ...args) => {
   return () => 'hi';
};

//this:
parse`dogGirl *{
  name: 'nomi',
  !setName: (state) => (name) => {
    state.name = name;
    return state
  }
  ^loudName: (state) => state.name + '!!!'
  -species: 'dog',
  -info: *{
    isCute: true,
    isScary: true,
  },
  -likes: *[
    -'dogs',
    'burrito'
  ]
}`;

//should become:
createState(
   node({
      name: mut('nomi'),
      species: imm('dog'),
      info: imm(
         createState(
            node({
               isCute: mut(true),
               isScary: mut(true),
            }),
         ),
      ),
      likes: imm(node([imm('dogs'), mut('burrito')])),
   }),
   (mutate) => ({
      setName: (name) =>
         mutate((state) => {
            state.name = name;
            return name;
         }),
   }),
);

export const subState = createState(
   node({ x: mut(1), y: imm(1) }),
   (mutate) => ({
      setX: (val) =>
         mutate((state) => {
            state.x = val;
            return state;
         }),
   }),
);

export const myState = createState(
   node({
      a: mut(1),
      b: mut(subState),
      x: imm(1),
      y: imm(node({ a: mut(1), b: imm(1) })),
   }),
   (mutate) => ({
      setA: (val) =>
         mutate((state) => {
            state.a = val;
            return state;
         }),
   }),
);

/* console.log(myState);
console.log(myState.props());
myState.mutate.setA(2);
myState.b.mutate.setX(4);
console.log(myState.b.props()); */

const pennyPlant = parse`{
  -timer,
  name,
}`;

const dogGirl = parse`{
  -name,
  !setName: (state) => (name) => {
    state.name = name;
    return state
  }
  ^loudName: (state) => state.name + '!!!'
  species: 'dog',
  info: {
    -isCute,
    -isScary,
  },
  plants
}`;

//const nomi = dogGirl({ name: nomi, info: { isCute: true, isScary: true } });

//console.log(hi);

/*
i want to define a data structure, supply it values from database

everything has default value, u hydrate it with object with same structure

plant {
  name: null,
  value: 1
}

garden = define({
  boxA: plant,
  boxB: null,
  water: 4,
  inventory: [

  ]
},)

hydrate(garden, {
  boxA: {name: 'bob'},
  boxB: {name: 'steve'},
  
})

needs to be nested 

hydrate({
  id: 'garden',
  value: {
    boxA: {
      id: 'plant'
      value: {
        name: 'bob'
      }
    },
    boxB: {
      id: 'plant'
      value: {
        name: 'steve',
        value: 2
      }
    },
    water: 5
  }
})

*/
