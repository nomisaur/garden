const isFunction = (value) => {
   return typeof value === 'function';
};

const isPromise = (value) => {
   return isFunction(value?.then);
};

const tryPromise = async (promise) => {
   try {
      return [await promise];
   } catch (err) {
      return [undefined, err];
   }
};

const safely = (thingToTry) => {
   if (isPromise(thingToTry)) {
      return tryPromise(thingToTry);
   }
   if (isFunction(thingToTry)) {
      try {
         const result = thingToTry();
         if (isPromise(result)) {
            return tryPromise(result);
         }
         return [result];
      } catch (err) {
         return [undefined, err];
      }
   }
   return [thingToTry];
};

////////////////////////// test

const thrower = () => {
   throw Error();
};

const asyncThrower = async () => {
   throw Error();
};

const timer = async (func = () => {}) => {
   const now = Date.now();
   await func();
   console.log(Date.now() - now);
};

(async () => {
   await timer();
   await timer(async () => {
      const [res1, err1] = safely(thrower);
      console.log({ res1, err1 });
   });
   await timer(async () => {
      const [res2, err2] = await safely(asyncThrower);
      console.log({ res2, err2 });
   });
   await timer(async () => {
      const [res3, err3] = await safely(asyncThrower());
      console.log({ res3, err3 });
   });
})();
