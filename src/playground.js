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
}) => {
  const state = {
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
  return makeState({
    getState,
    getSignedState,
    getProps,
    mutate,
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
  return makeState({
    getState,
    getSignedState,
    getProps,
    mutate,
    getSignedState,
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
        if (newState[$signature]) {
          state.current[key][$mutate](() => {
            return newSubState[key];
          });
        } else {
          state.current[key] = mut(newSubState[key]);
        }
      } else {
        delete state.current[key];
      }
    });
  };
  return makeState({
    getState,
    getProps,
    mutate,
    getSignedState,
  });
};

/* const state = (init, getMutations = noop) => {
  const node = { current: init };

  //const mutations = getMutations((fn) => node.current[$mutate](fn));

  return {
    state() {
      return node.current.state();
    },
    props() {
      return node.current.props();
    },
    changeA(val) {
      node.current[$mutate]((state) => {
        state.a = val;
        console.log(state);
        return state;
      });
    },
  };
}; */

const state = (hey, getMutations) => {
  const mutations = getMutations(hey[$mutate]);

  return {
    state: () => hey.state(),
    props: () => hey.props(),
    mutate: mutations,
  };
};

/* export const myState = state(
  node({
    //a: mut(1),
    b: mut(node({ c: mut(1) })),
    //b: mut(node({ a: mut(1), b: imm(1) })),
    //x: imm(1),
    //y: imm(node({ a: mut(1), b: imm(1) })),
  }),
  (mutate) => {
    return {
      changeA: (val) => {
        mutate((state) => {
          state.b.c = val;
          return state;
        });
      },
    };
  },
); */

/* export const myState = state(
  node({
    a: mut(1),
    b: mut(node({ a: mut(1), b: imm(1) })),
    x: imm(1),
    y: imm(node({ a: mut(1), b: imm(1) })),
  }),
  (mutate) => ({
    changeA: (val) => {
      console.log(val, mutate);
      mutate((state) => {
        console.log('mutate!!', state);
        state.a = val;
        console.log('mut', state);
        return state;
      });
    },
  }),
); */

/* console.log(myState.props());
myState.mutate.changeA(2);
console.log(myState.props()); */

export const myState = node({
  b: mut(node({ c: mut(1) })),
});

myState[$mutate]((state) => {
  state.b.c = 2;
  return state;
});
console.log(myState.props());
