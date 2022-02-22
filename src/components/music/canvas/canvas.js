import React, { useRef, useEffect } from 'react';

export const Canvas = ({ draw, ...props }) => {
   const canvasRef = useRef(null);

   useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const drawFn = draw(context);

      let animationFrameId;

      const render = () => {
         drawFn();
         animationFrameId = window.requestAnimationFrame(render);
      };

      render();

      return () => {
         window.cancelAnimationFrame(animationFrameId);
      };
   }, [draw]);

   return <canvas ref={canvasRef} {...props} />;
};
