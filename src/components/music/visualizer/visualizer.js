import React, { useState, useEffect, useReducer, useRef } from 'react';
import { useMusicContext } from '../../../hooks';
import { Canvas } from '../canvas';

export const Visualizer = () => {
   const { analyser } = useMusicContext();
   analyser.fftSize = 2048;
   const bufferLength = analyser.frequencyBinCount;
   const dataArray = new Uint8Array(bufferLength);

   return (
      <Canvas
         height={200}
         width={window.innerWidth}
         setup={(canvasCtx) => {
            canvasCtx.fillStyle = '#000';
            canvasCtx.strokeStyle = '#fff';
            canvasCtx.lineWidth = 1;
            return {
               width: canvasCtx.canvas.width,
               height: canvasCtx.canvas.height,
               sliceWidth: (canvasCtx.canvas.width * 1.0) / bufferLength,
            };
         }}
         draw={(canvasCtx, { width, height, sliceWidth }) => {
            analyser.getByteTimeDomainData(dataArray);
            canvasCtx.clearRect(0, 0, width, height);
            canvasCtx.beginPath();
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
               const v = dataArray[i] / 128.0;
               const y = (v * height) / 2;

               if (i === 0) {
                  canvasCtx.moveTo(x, y);
               } else {
                  canvasCtx.lineTo(x, y);
               }

               x += sliceWidth;
            }
            canvasCtx.stroke();
         }}
      />
   );
};
