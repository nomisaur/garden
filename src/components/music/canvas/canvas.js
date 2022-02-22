import React, { useRef, useEffect } from 'react';

export const Canvas = ({ draw, setup, ...props }) => {
   const canvasRef = useRef(null);

   useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const drawArgs = setup(context);

      let animationFrameId;

      const render = () => {
         draw(context, drawArgs);
         animationFrameId = window.requestAnimationFrame(render);
      };

      render();

      return () => {
         window.cancelAnimationFrame(animationFrameId);
      };
   }, [draw]);

   return <canvas ref={canvasRef} {...props} />;
};
