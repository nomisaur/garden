import _clone from "rfdc";

const clone = _clone();

const getQueryParams = () => {
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

const time = ({
  milliseconds = 0,
  seconds = 0,
  minutes = 0,
  hours = 0,
  days = 0,
}) => {
  return (
    milliseconds +
    secondsToMilliseconds(seconds) +
    minutesToMilliseconds(minutes) +
    hoursToMilliseconds(hours) +
    daysToMilliseconds(days)
  );
};

const addToPayload = (setState, addition) => {
  return (action, payload = {}) => {
    setState(action, {
      ...payload,
      ...addition,
    });
  };
};

export { addToPayload, time, getQueryParams, clone };
