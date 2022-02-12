import _clone from 'rfdc';
import { isDev } from './config';

export const clone = _clone();

export const log = (...args) => {
   if (isDev) {
      console.log(...args);
   }
};

const getQueryParams = () => {
   const paramsIter = new URL(window.location.href).searchParams.entries();
   const params = {};

   for (const [key, value] of paramsIter) {
      params[key] = value;
   }

   return params;
};

export const queryParams = getQueryParams();

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

export const addToPayload = (handleState, addition = {}) => {
   return (handler, payload = {}) => {
      handleState(handler, {
         ...payload,
         ...addition,
      });
   };
};

export const isFunction = (thing) => thing instanceof Function;

export const list = (num, arg = (a) => a) => {
   const func = isFunction(arg) ? arg : () => arg;
   return [...Array(num)].map((_, i) => func(i));
};

export const includeIf = (condition, item) =>
   condition && item != null ? [item] : [];

export const arrayToObject = (list, getKey) =>
   list.reduce((grow, feed) => ({ ...grow, [getKey(feed)]: feed }), {});

export const displayNumber = (num) => {
   const string = num.toFixed(1);
   const [whole, decimal] = string.split('.');
   return decimal === '0' ? whole : string;
};

export const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const reduceFraction = ([a, b]) => {
   const reducer = gcd(a, b);
   return [a / reducer, b / reducer];
};
