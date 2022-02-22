import React, { useState } from 'react';
import { useMusicContext, useWindowDimensions } from '../../../hooks';
import { Canvas } from '../canvas';

export const Visualizer = () => {
   const { analyser } = useMusicContext();
   const { width } = useWindowDimensions();
   const [weirdMode, setWeirdMode] = useState(false);

   analyser.fftSize = 2048;
   const bufferLength = analyser.frequencyBinCount;
   const dataArray = new Uint8Array(bufferLength);

   const draw = weirdMode
      ? (canvasCtx, canvas) => {
           const { width, height } = canvasCtx.canvas;
           canvasCtx.fillStyle = '#000';
           canvasCtx.strokeStyle = '#fff';
           canvasCtx.lineWidth = 1;
           const speed = 1;

           const tempCanvas = document.createElement('canvas');
           const tempCtx = tempCanvas.getContext('2d');
           tempCanvas.width = width;
           tempCanvas.height = height;

           analyser.getByteTimeDomainData(dataArray);
           let last = height / 2;
           return () => {
              tempCtx.clearRect(0, 0, width, height);
              tempCtx.drawImage(canvas, 0, 0, width, height);

              canvasCtx.clearRect(0, 0, width, height);
              canvasCtx.drawImage(tempCanvas, speed, 0, width, height);

              analyser.getByteTimeDomainData(dataArray);
              const y = ((dataArray[0] / 128) * height) / 2;

              canvasCtx.beginPath();
              canvasCtx.moveTo(speed, last);
              canvasCtx.lineTo(0, y);
              canvasCtx.stroke();
              last = y;
           };
        }
      : (canvasCtx) => {
           const { width, height } = canvasCtx.canvas;
           const sliceWidth = (width * 1.0) / bufferLength;
           canvasCtx.fillStyle = '#000';
           canvasCtx.strokeStyle = '#fff';
           canvasCtx.lineWidth = 1;
           return (timeSinceLastFrame) => {
              //console.log(timeSinceLastFrame);
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
        };

   return (
      <>
         <div>
            weird mode:
            <input
               type='checkbox'
               checked={weirdMode}
               onChange={(e) => setWeirdMode(e.target.checked)}
            />
         </div>
         <Canvas height={200} width={width} draw={draw} />
      </>
   );
};
