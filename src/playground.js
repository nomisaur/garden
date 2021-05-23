const getType = (state, filterType, getVal = (a) => a) => {
  return Object.entries(state)
    .filter(([, { type }]) => type === filterType)
    .reduce((grow, [prop, leaf]) => ({ ...grow, [prop]: getVal(leaf) }), {});
};

const node = (state) => {
  //const mutable = getType(state, 'mutable', (a) => a.val);
  //const immutable = getType(state, 'immutable', (a) => a.val);
  const mutable = Object.entries(state).reduce((grow, [prop, leaf]) => {
    if (leaf.type === 'mutable') {
      grow[prop] = leaf.val;
    }
    return grow;
  }, {});

  const immutable = Object.entries(state).reduce((grow, [prop, leaf]) => {
    if (leaf.type === 'immutable') {
      grow[prop] = leaf.val;
    }
    return grow;
  }, {});

  /* const getState = () => ({
    ...mutable,
    ...getType(state, 'node', (a) => a.getState()),
  }); */

  const getState = () => {
    return Object.entries(state).reduce((grow, [prop, leaf]) => {
      if (leaf.type === 'mutable') {
        grow[prop] = mutable[prop];
      }
      if (leaf.type === 'node' || leaf.type === 'list') {
        grow[prop] = leaf.getState();
      }
      return grow;
    }, {});
  };

  const getProps = () => {
    const realValues = Object.entries(state).reduce((grow, [prop, leaf]) => {
      if (leaf.type === 'mutable') {
        grow[prop] = mutable[prop];
      }
      if (leaf.type === 'immutable') {
        grow[prop] = immutable[prop];
      }
      if (leaf.type === 'node' || leaf.type === 'list') {
        grow[prop] = leaf.getProps();
      }
      return grow;
    }, {});

    return Object.entries(state).reduce((grow, [prop, leaf]) => {
      if (leaf.type === 'virtual') {
        grow[prop] = leaf.val(realValues);
      } else {
        grow[prop] = realValues[prop];
      }
      return grow;
    }, {});
  };

  /* const getProps = () => {
    const nodeValues = getType(state, 'node', (a) => a.getProps());
    const realValues = {
      ...mutable,
      ...nodeValues,
      ...immutable,
    };
    return {
      ...mutable,
      ...nodeValues,
      ...immutable,
      ...getType(state, 'virtual', (a) => a.val(realValues)),
    };
  }; */

  const mutate = (fn) => {
    const newState = fn(getState());
    Object.keys(newState).forEach((prop) => {
      if (mutable.hasOwnProperty(prop)) {
        mutable[prop] = newState[prop];
      } else {
        state[prop].mutate(() => newState[prop]);
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
};

const list = (state) => {
  const mutable = state.reduce((grow, leaf, index) => {
    if (leaf.type === 'mutable') {
      grow[index] = leaf.val;
    }
    return grow;
  }, []);

  const immutable = state.reduce((grow, leaf, index) => {
    if (leaf.type === 'immutable') {
      grow[index] = leaf.val;
    }
    return grow;
  }, []);

  const getState = () => {
    return state.reduce((grow, leaf, index) => {
      if (leaf.type === 'mutable') {
        grow[index] = mutable[index];
      }
      if (leaf.type === 'node' || leaf.type === 'list') {
        grow[index] = leaf.getState();
      }
      return grow;
    }, []);
  };

  const getProps = () => {
    const realValues = state.reduce((grow, leaf, index) => {
      if (leaf.type === 'mutable') {
        grow[index] = mutable[index];
      }
      if (leaf.type === 'immutable') {
        grow[index] = immutable[index];
      }
      if (leaf.type === 'node' || leaf.type === 'list') {
        grow[index] = leaf.getProps();
      }
      return grow;
    }, []);

    return state.reduce((grow, leaf, index) => {
      if (leaf.type === 'virtual') {
        grow[index] = leaf.val(realValues);
      } else {
        grow[index] = realValues[index];
      }
      return grow;
    }, []);
  };

  const mutate = (fn) => {
    const newState = fn(getState());
    newState.forEach((item, i) => {
      if (mutable.hasOwnProperty(i)) {
        mutable[i] = item;
      } else {
        state[i].mutate(() => item);
      }
    });
  };

  return {
    type: 'list',
    getState,
    getProps,
    mutate,
    state,
  };
};

const mut = (val) => ({ val, type: 'mutable' });
const imm = (val) => ({ val, type: 'immutable' });
const virt = (val) => ({ val, type: 'virtual' });

//export const state = node({ a: mut(1), b: imm(2) });

/* export const state = node({
  stateA: mut('a'),
  stateB: mut('b'),
  modelA: imm(1),
  modelB: imm(2),
  thingA: node({
    stateA: mut('c'),
    stateB: mut('d'),
    modelA: imm(3),
    modelB: imm(4),
    thing: node({
      stateA: mut('e'),
      stateB: mut('f'),
    }),
    virtA: virt(({ stateA, thing: { stateB } }) => stateA + stateB),
    virtB: virt(({ virtA }) => virtA + 1),
  }),
  thingB: node({
    modelA: imm(5),
    modelB: imm(6),
  }),
  virtA: virt(({ stateA, thingA: { modelB } }) => stateA + modelB),
}); */

/* export const state = node({
  stateA: mut('a'),
  modelB: imm(2),
  listA: node([
    node({ a: mut(7), b: imm(8) }),
    8,
    9,
    'veryveryvreysoleuau.uapiapiapipaipip',
  ]),
  listB: imm([10, 11, 12]),
  thingA: node({
    stateA: mut('c'),
    modelA: imm(3),
    virtA: virt(({ stateA, modelA }) => stateA + modelA),
  }),
  virtA: virt(({ stateA, thingA: { modelA } }) => stateA + modelA),
}); */

export const state = list([
  imm('immA'),
  mut('mutA'),
  virt((beep) => beep[1] + '!!!'),
  node({ a: mut('mutB'), b: imm('immB') }),
]);

console.log('getState', state.getState());
console.log('getProps', state.getProps());
state.mutate((state) => {
  /* state.stateA = 'z';
  state.thingA.stateA = 'y';
  //state.listA[0].a = 2; */
  state[1] = 'bob';
  return state;
});
console.log('---');
console.log('getState', state.getState());
console.log('getProps', state.getProps());
