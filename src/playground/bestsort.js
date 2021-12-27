const nums = [3, 1, 2, 4];

const inOrder = (list) =>
   list.reduce(
      ([result, previous], current) => [previous <= current && result, current],
      [true, -Infinity],
   )[0];

const randomNumber = (start, end) =>
   Math.floor(Math.random() * (end - start)) + start;

const randomShuffle = (list) => {
   const copy = [...list];
   const indexes = copy.map((_, i) => i);
   for (let count = 0; count < list.length; count++) {
      list[count] =
         copy[indexes.splice(Math.floor(Math.random() * indexes.length), 1)];
   }
};
const bestsort = (list) => {
   let iterations = 0;
   while (!inOrder(list)) {
      randomShuffle(list);
      iterations++;
   }
   console.log({ iterations });
   return list;
};

console.log(bestsort(nums));
