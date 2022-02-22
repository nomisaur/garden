import React, { useState, useEffect, useReducer, useRef } from 'react';
import { useMusicContext } from '../../../hooks';
import { Canvas } from '../canvas';

export const Visualizer = () => {
   const { audioCtx, masterGain, analyser } = useMusicContext();
   const bufferLength = analyser.frequencyBinCount;
   const [dataArray] = useState(new Uint8Array(bufferLength));
   useEffect(() => {
      analyser.getByteTimeDomainData(dataArray);
   }, []);

   return (
      <Canvas
         height={200}
         width={1100}
         style={{ padding: '5px' }}
         draw={(canvasCtx) => {
            const { width, height } = canvasCtx.canvas;
            analyser.getByteTimeDomainData(dataArray);
            canvasCtx.clearRect(0, 0, width, height);
            canvasCtx.beginPath();
            const sliceWidth = (width * 1.0) / bufferLength;
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
            canvasCtx.lineTo(width, height / 2);
            canvasCtx.stroke();
         }}
      />
   );
};
