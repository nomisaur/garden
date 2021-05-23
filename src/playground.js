const getType = (state, filterType, getVal = (a) => a) => {
  //const isList = Array.isArray(state);
  return Object.entries(state)
    .filter(([, { type }]) => type === filterType)
    .reduce((grow, [prop, leaf]) => ({ ...grow, [prop]: getVal(leaf) }), {});
};

const node = (state) => {
  const mutable = getType(state, 'mutable', (a) => a.val);

  const immutable = getType(state, 'immutable', (a) => a.val);

  const getState = () => ({
    ...mutable,
    ...getType(state, 'node', (a) => a.getState()),
  });

  const getProps = () => {
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
  };

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

const mut = (val) => ({ val, type: 'mutable' });
const imm = (val) => ({ val, type: 'immutable' });
const virt = (val) => ({ val, type: 'virtual' });
const list = (val) => ({ val, type: 'list' });

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

export const state = node([mut(1), imm(2), node({ a: mut(3), b: imm(4) })]);

console.log('getState', state.getState());
console.log('getProps', state.getProps());
state.mutate((state) => {
  /* state.stateA = 'z';
  state.thingA.stateA = 'y'; */
  //state.listA[0].a = 2;

  console.log(state);
  return state;
});
console.log('---');
console.log('getState', state.getState());
console.log('getProps', state.getProps());
