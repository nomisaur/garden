import React from 'react';
import { useMusicContext, useWindowDimensions } from '../../../hooks';
import { Canvas } from '../canvas';

export const Visualizer = () => {
   const { analyser } = useMusicContext();
   const { width } = useWindowDimensions();

   analyser.fftSize = 2048;
   const bufferLength = analyser.frequencyBinCount;
   const dataArray = new Uint8Array(bufferLength);

   return (
      <Canvas
         height={200}
         width={width}
         draw={(canvasCtx) => {
            const { width, height } = canvasCtx.canvas;
            const sliceWidth = (width * 1.0) / bufferLength;
            canvasCtx.fillStyle = '#000';
            canvasCtx.strokeStyle = '#fff';
            canvasCtx.lineWidth = 1;
            return () => {
               analyser.getByteTimeDomainData(dataArray);
               canvasCtx.clearRect(0, 0, width, height);
               canvasCtx.beginPath();
               let x = 0;
               for (let i = 0; i < bufferLength; i++) {
                  const v = dataArray[i] / 128.0;
                  const y = (v * height) / 2;
                  canvasCtx.lineTo(x, y);
                  x += sliceWidth;
               }
               canvasCtx.stroke();
            };
         }}
      />
   );
};
