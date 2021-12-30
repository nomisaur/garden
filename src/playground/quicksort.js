const nums2 = [
   [1, 'a'],
   [4, 'a'],
   [2, 'b'],

   [2, 'a'],
   [1, 'b'],
   [3, 'a'],
];

const nums = [1, 4, 2, 1, 2, 3];

const quicksortDestructive = (list, comparitor = (a, b) => a <= b) => {
   const iterate = (start, end) => {
      if (end - start < 1) {
         return;
      }
      let low = start;
      let high = end;
      let direction = true;
      while (low < high) {
         while (
            low < high &&
            (comparitor(list[low], list[high]) ||
               !comparitor(list[high], list[low]))
         ) {
            direction ? high-- : low++;
         }
         const temp = list[low];
         list[low] = list[high];
         list[high] = temp;
         direction = !direction;
      }
      iterate(start, low);
      iterate(low + 1, end);
   };
   iterate(0, list.length - 1);
   return list;
};
const quicksort = (list, comparitor) =>
   quicksortDestructive([...list], comparitor);

console.log(quicksort(nums, (a, b) => a < b));
