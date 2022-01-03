export const fit = (n) => {
   const gridSize = 32;
   const into = 15;
   const percentage = n / gridSize;
   const newValue = percentage * into;
   const truncated = parseInt(newValue.toFixed(0));
   const hex = truncated.toString(into + 1);

   console.log({ n, percentage, newValue, truncated, hex });
};

//[0, 1, 29, 31, 32].forEach(fit);

window.fit = fit;
