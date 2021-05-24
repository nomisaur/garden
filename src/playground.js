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

export const stateSymbol = Symbol('~');
export const signedState = Symbol('signedState');
export const empty = Symbol('empty');

export const sign = (obj) => {
  Object.defineProperty(obj, stateSymbol, {
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
    mutate,
  };
  Object.defineProperty(state, signedState, {
    value: getSignedState,
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
    if (state.current && state.current[stateSymbol]) {
      return state.current.state();
    } else {
      return state.current;
    }
  };
  const getSignedState = () => {
    if (state.current && state.current[stateSymbol]) {
      return state.current[signedState]();
    } else {
      return state.current;
    }
  };
  const getProps = () => {
    if (state.current && state.current[stateSymbol]) {
      return state.current.props();
    } else {
      return state.current;
    }
  };
  const mutate = (editFunction) => {
    state.current = editFunction();
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
    if (init && init[stateSymbol]) {
      return init.state();
    } else {
      return empty;
    }
  };
  const getSignedState = () => {
    if (init && init[stateSymbol]) {
      return init[signedState]();
    } else {
      return empty;
    }
  };
  const getProps = () => {
    if (init && init[stateSymbol]) {
      return init.props();
    } else {
      return init;
    }
  };
  const mutate = (editFunction) => {
    if (init && init[stateSymbol]) {
      return init.mutate(editFunction);
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
      if (childState !== empty) {
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
          const childState = val[signedState]();
          if (childState !== empty) {
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
      if (childProps !== empty) {
        grow[key] = childProps;
      }
      return grow;
    });
  };

  const mutate = (editFunction = noop) => {
    const newState = editFunction(getSignedState());
    commonForEach(getState(), (key) => {
      if (newState && newState.hasOwnProperty(key)) {
        if (newState[stateSymbol]) {
          state.current[key].mutate(() => newState[key]);
        } else {
          state.current[key] = mut(newState[key]);
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

export const myState = node({
  a: mut(1),
  b: mut(node({ a: mut(1), b: imm(1) })),
  x: imm(1),
  y: imm(node({ a: mut(1), b: imm(1) })),
});

myState.mutate((state) => {
  state.a = 2;
  state.b = 2;
  state.x = 2;
  state.y.a = 2;
  return state;
});

console.log(myState.props());

/* 
const myState = node({
  mutable a: mut(1),
  mutable b: mut(node({ a: mut(1), b: imm(1) })),
  x: imm(1),
  y: imm(node({ a: mut(1), b: imm(1) })),
});
*/

/* export const a = node({ a: mut(undefined), b: imm(undefined) });
console.log('a', a.props()); */

/* export const listNode = (init) => {
  const state = { current: init };
  const getState = () => {
    return state.current.reduce((grow, val, key) => {
      const childState = val.state();
      if (childState !== empty) {
        grow[key] = childState;
      }
      return grow;
    }, []);
  };
  const getSignedState = () => {
    return sign(
      state.current.reduce((grow, val, key) => {
        const childState = val[signedState]();
        if (childState !== empty) {
          grow[key] = childState;
        }
        return grow;
      }, []),
    );
  };
  const getProps = () => {
    return state.current.reduce((grow, val, key) => {
      const childProps = val.props();
      if (childProps !== empty) {
        grow[key] = childProps;
      }
      return grow;
    }, []);
  };
  const mutate = (editFunction = noop) => {
    const newState = editFunction(getSignedState());
    getState().forEach((_, key) => {
      if (newState && newState.hasOwnProperty(key)) {
        if (newState[stateSymbol]) {
          state.current[key].mutate(() => newState[key]);
        } else {
          state.current[key] = mut(newState[key]);
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
}; */

/* export const a = listNode([mut(undefined), imm(1)]);
console.log(a.props());
a.mutate((state) => {
  console.log('mutate!', state);
  state[0] = 2;
  return state;
});
console.log(a.props()); */
/* export const a = node({ a: mut(1), b: mut(listNode([mut(1)])) });
console.log(a.props());
a.mutate((state) => {
  console.log('mutate!', state);
  state.a = 2;
  state.b[0] = 2;
  return state;
});
console.log(a.props()); */

//export const b = node([mut(1), imm(1)]);

/* const makeState = obj => {
  Object.setPrototypeOf(obj, parent)
}
 */
/* const getNodeReducer = (state) => (func) => {
  return Array.isArray(state)
    ? state.reduce((grow, leaf, index) => func(grow, index, leaf), [])
    : Object.entries(state).reduce(
        (grow, [prop, leaf]) => func(grow, prop, leaf),
        {},
      );
};

const getNodeMutator = (state) => (newState, func) => {
  return Array.isArray(state)
    ? newState.forEach((item, i) => {
        func(i, item);
      })
    : Object.keys(newState).forEach((prop) => {
        func(prop, newState[prop]);
      });
};

const node = (state) => {
  const nodeReducer = getNodeReducer(state);
  const nodeMutator = getNodeMutator(state);

  const mutable = nodeReducer((grow, key, leaf) => {
    if (leaf.type === 'mutable') {
      grow[key] = leaf.val;
    }
    return grow;
  });

  const immutable = nodeReducer((grow, key, leaf) => {
    if (leaf.type === 'immutable') {
      grow[key] = leaf.val;
    }
    return grow;
  });

  const nodes = nodeReducer((grow, key, leaf) => {
    if (leaf.type === 'node') {
      grow[key] = leaf.val;
    }
    return grow;
  });

  const getState = () => {
    return nodeReducer((grow, key, leaf) => {
      if (leaf.type === 'mutable') {
        grow[key] = mutable[key];
      }
      if (leaf.type === 'node') {
        grow[key] = leaf.getState();
      }
      return grow;
    });
  };

  const getProps = () => {
    const realValues = nodeReducer((grow, key, leaf) => {
      if (leaf.type === 'mutable') {
        grow[key] = mutable[key];
      }
      if (leaf.type === 'immutable') {
        grow[key] = immutable[key];
      }
      if (leaf.type === 'node' || leaf.type === 'list') {
        grow[key] = leaf.getProps();
      }
      return grow;
    });

    return nodeReducer((grow, key, leaf) => {
      if (leaf.type === 'virtual') {
        grow[key] = leaf.val(realValues);
      } else {
        grow[key] = realValues[key];
      }
      return grow;
    });
  };

  const mutate = (fn) => {
    const newState = fn(getState());
    nodeMutator(newState, (key, item) => {
      if (mutable.hasOwnProperty(key)) {
        mutable[key] = item;
      } else if (nodes.hasOwnProperty(key)) {
        state[key].mutate(() => item);
      }
    });
  };

  return {
    type: 'node',
    getState,
    getProps,
    mutate,
    state,
  };
}; */
/* import _clone from 'rfdc';
export const clone = _clone();

const commonReducer = (target, func) => {
  return Array.isArray(target)
    ? target.reduce((grow, item, index) => func(grow, index, item), [])
    : Object.entries(target).reduce(
        (grow, [prop, item]) => func(grow, prop, item),
        {},
      );
};

const stateSymbol = Symbol('~');

export const mut = (val) => {
  const state = { current: val };
  const getState = () => state.current;
  const getProps = () => state.current;
  const mutate = () => {};
  const mutateSelf = () => {};
  return {
    type: 'mutable',
    getState,
    getProps,
    mutate,
    mutateSelf,
  };
};

export const imm = (val) => {
  const getState = () => {};
  const getProps = () => val;
  const mutate = () => {};
  const mutateSelf = () => {};
  return {
    type: 'mutable',
    getState,
    getProps,
    mutate,
    mutateSelf,
  };
};

mut.node = (val) => {
  const state = { current: val };
  const getState = () => {
    return commonReducer(state.current, (grow, key, item) => {
      grow[key] = item.getState();
      grow[stateSymbol] = true;
      return grow;
    });
  };
  const getProps = () => {
    return commonReducer(state.current, (grow, key, item) => {
      grow[key] = item.getProps();
      return grow;
    });
  };
  const mutate = (fn) => {};
  return {
    type: 'mutable',
    getState,
    getProps,
    mutate,
    show: () => state,
  };
}; */

/* imm.node = (val) => {
  const state = { current: val };
  const getState = () => {
    return commonReducer(state.current, (grow, key, item) => {
      grow[key] = item.getState();
      grow[stateSymbol] = true;
      return grow;
    });
  };
  const getProps = () => {
    return commonReducer(state.current, (grow, key, item) => {
      grow[key] = item.getProps();
      return grow;
    });
  };
  const mutate = (fn) => {
    console.log(getState());
    const newState = fn(getState());
    console.log(newState);
    commonReducer(newState, (grow, key, item) => {
      state.current[key] = mut(item);
      if (getState().hasOwnProperty(key)) {
        state.current[key].mutate(() => item);
      }
    });
  };
  return {
    type: 'mutable',
    getState,
    getProps,
    mutate,
    show: () => state,
  };
}; */

/* mut.node = (val) => {
  const state = { current: val };
  const getState = () => {
    return commonReducer(state.current, (grow, key, item) => {
      grow[key] = item.getState();
      grow[stateSymbol] = true;
      return grow;
    });
  };
  const getProps = () => {
    return commonReducer(state.current, (grow, key, item) => {
      grow[key] = item.getProps();
      return grow;
    });
  };
  const mutate = (fn) => {
    const newState = fn(state.current);
    console.log(newState);
    console.log(newState);
    console.log(state.current);
    console.log(getState());
    const newState = fn(getState());
    console.log('new', fn(newState));
    state.current = mut(newState);
    //console.log(newState);
    commonReducer(newState, (grow, key, item) => {
      if (getState().hasOwnProperty(key)) {
        console.log(state, item);
        //console.log(state, key);
        state.current = mut(item);
        //state.current[key].mutate(() => item);
      }
    });
  };
  return {
    type: 'mutable',
    getState,
    getProps,
    mutate,
    show: () => state,
  };
}; */

/* const virt = (val) => {
  return { val, type: 'virtual' };
}; */

/* const state = imm.node({ a: mut.node({ b: imm(1) }) });
console.log(state.getState(), state.getProps());
state.mutate((state) => {
  console.log(state);
  //state.a = 3;
  return state;
});
console.log(state.getState(), state.getProps()); */

/* const state = mut.node({
  a: mut.node({ y: mut(1), z: imm(1) }),
  b: imm.node({ y: mut(1), z: imm(1) }),
  c: mut.node({ y: mut(1), z: imm(1) }),
  d: imm.node({ y: mut(1), z: imm(1) }),
});
//console.log(state);
console.log(state.getState(), state.getProps());
state.mutate((state) => {
  console.log('mutation state', state);
  state.a = 2;
  state.b = 2;
  state.c.y = 2;
  state.c.z = 2;
  state.d.y = 2;
  state.d.z = 2;
  return state;
}); */
//console.log(state.show());
/* console.log(state);
console.log(state.getState()); */
//console.log(state.getState(), state.getProps());

/* const state = imm.node([mut(1), imm(1)]);
console.log(state.getState(), state.getProps());
state.mutate((state) => {
  state[0] = 2;
  state[1] = 2;
  return state;
});
console.log(state.getState(), state.getProps()); */

/* const state = node({ a: node({ a: mut(1) }), b: node({ b: mut(2) }) });

console.log(state.getState()); */

/* const state = node({
  am: mut('am'),
  ai: imm('ai'),
  al: node([
    mut('bm'),
    imm('bi'),
    node({
      cm: mut('cm'),
      ci: imm('ci'),
    }),
    virt((state) => state[0] + state[2].ci),
  ]),
  av: virt((state) => state.am + state.al[1] + state.al[2].cm),
});

console.log('getState', state.getState());
console.log('getProps', state.getProps());
state.mutate((state) => {
  state.am = 'AM';
  state.ai = 'AI';
  state.al[0] = 'BM';
  state.al[1] = 'BI';
  state.al[2].cm = 'CM';
  state.av = '!!!';
  return state;
});
console.log('---');
console.log('getState', state.getState());
console.log('getProps', state.getProps()); */
