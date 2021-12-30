import safely from '@emberscodes/safely';

const why = async () => {};

//window.safely = safely;

////////////////////////// test
//console.log(safely(() => 'hi'));

const thrower = () => {
   throw 'hi';
};

const asyncThrower = async () => {
   throw 'hi';
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
