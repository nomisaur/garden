import restate from 'restate';
import stateModel from 'stateModel';

const savedState = getLocalStorage();

const [state, setState] = restate(savedState, stateModel);

state.screen;
state.setScreen('garden');

state.planters[0].harvest();

state().json();

// state is function with props
