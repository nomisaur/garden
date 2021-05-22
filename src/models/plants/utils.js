export const definePlant = ({ images, stages, defaultStage, ...rest }) => {
  return {
    ...rest,
    lifeStages: stages.map((stage, index) => {
      return {
        ...defaultStage,
        ...stage,
        image: images[index],
      };
    }),
  };
};
