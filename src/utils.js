import _clone from 'rfdc';

export const clone = _clone();

export const getQueryParams = () => {
  const paramsIter = new URL(window.location.href).searchParams.entries();
  const params = {};

  for (const [key, value] of paramsIter) {
    params[key] = value;
  }

  return params;
};

const secondsToMilliseconds = (seconds) => seconds * 1000;

const minutesToMilliseconds = (minutes) => secondsToMilliseconds(minutes * 60);

const hoursToMilliseconds = (hours) => minutesToMilliseconds(hours * 60);

const daysToMilliseconds = (days) => hoursToMilliseconds(days * 24);

export const time = (arg) => {
  if (typeof arg === 'number') {
    return arg;
  }
  const {
    milliseconds = 0,
    seconds = 0,
    minutes = 0,
    hours = 0,
    days = 0,
  } = arg;
  return (
    milliseconds +
    secondsToMilliseconds(seconds) +
    minutesToMilliseconds(minutes) +
    hoursToMilliseconds(hours) +
    daysToMilliseconds(days)
  );
};

export const addToPayload = (handleState, addition) => {
  return (handler, payload = {}) => {
    handleState(handler, {
      ...payload,
      ...addition,
    });
  };
};

const numberList = (num) => [...Array(num)];
export const list = (num, func) => numberList(num).map((_, i) => func(i));

export const includeIf = (item, condition) =>
  condition && item != null ? [item] : [];
