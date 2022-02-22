import React, { useRef, useEffect } from 'react';

export const Canvas = ({ draw, ...props }) => {
   const canvasRef = useRef(null);

   useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.fillStyle = '#000';
      context.lineWidth = 1;
      context.strokeStyle = '#fff';
      let animationFrameId;

      const render = () => {
         draw(context);
         animationFrameId = window.requestAnimationFrame(render);
      };
      render();

      return () => {
         window.cancelAnimationFrame(animationFrameId);
      };
   }, [draw]);

   console.log('Canvas render');

   return <canvas ref={canvasRef} {...props} />;
};
