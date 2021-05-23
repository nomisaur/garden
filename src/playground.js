const getNodeReducer = (state) => (func) => {
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

    return Object.entries(state).reduce((grow, [prop, leaf]) => {
      if (leaf.type === 'virtual') {
        grow[prop] = leaf.val(realValues);
      } else {
        grow[prop] = realValues[prop];
      }
      return grow;
    }, {});
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
};

const mut = (val) => ({ val, type: 'mutable' });
const imm = (val) => ({ val, type: 'immutable' });
const virt = (val) => ({ val, type: 'virtual' });

const state = node({
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
console.log('getProps', state.getProps());
