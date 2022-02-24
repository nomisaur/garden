import React, { useState } from 'react';
import { useMusicContext, useWindowDimensions } from '../../../hooks';
import { Canvas } from '../canvas';
import { initialWeirdMode, initialSpeed } from '../../../config';

export const Visualizer = () => {
   const { analyser, audioCtx } = useMusicContext();
   const { width } = useWindowDimensions();
   const [weirdMode, setWeirdMode] = useState(initialWeirdMode);
   const [speed, setSpeed] = useState(initialSpeed);

   analyser.fftSize = 2048;
   const bufferLength = analyser.frequencyBinCount;
   const dataArray = new Uint8Array(bufferLength);

   const weirdDraw = (canvasCtx, canvas) => {
      const { width, height } = canvasCtx.canvas;
      canvasCtx.fillStyle = '#000';
      canvasCtx.strokeStyle = '#fff';
      canvasCtx.lineWidth = 1;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = width;
      tempCanvas.height = height;

      const timePerBuffer = (bufferLength / audioCtx.sampleRate) * 1000;
      const speedMinusOne = speed - 1;
      const timeMultiplier = bufferLength / timePerBuffer / speed;
      const yMultiplier = height / 256;

      analyser.getByteTimeDomainData(dataArray);

      let last = height / 2;

      return (timeSinceLastFrame) => {
         const bufferJumpSpacing = timeSinceLastFrame * timeMultiplier;

         tempCtx.clearRect(0, 0, width, height);
         tempCtx.drawImage(canvas, 0, 0, width, height);

         canvasCtx.clearRect(0, 0, width, height);
         canvasCtx.drawImage(tempCanvas, speed, 0, width, height);

         analyser.getByteTimeDomainData(dataArray);

         canvasCtx.beginPath();
         canvasCtx.moveTo(speed, last);
         canvasCtx.strokeRect(0, 0, 1, 1);
         for (let i = 0; i < speed; i++) {
            const y =
               dataArray[Math.round(i * bufferJumpSpacing)] * yMultiplier;
            canvasCtx.lineTo(speedMinusOne - i, y);
            //canvasCtx.strokeRect(speedMinusOne - i, y, 1, 1);
            last = y;
         }
         canvasCtx.stroke();
      };
   };

   const normalDraw = (canvasCtx) => {
      const { width, height } = canvasCtx.canvas;
      const sliceWidth = (width * 1.0) / bufferLength;
      canvasCtx.fillStyle = '#000';
      canvasCtx.strokeStyle = '#fff';
      canvasCtx.lineWidth = 1;
      return (timeSinceLastFrame) => {
         console.log(timeSinceLastFrame);
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
         <div>
            speed:
            <input
               type='range'
               value={speed}
               min='1'
               max='500'
               step='1'
               onChange={(e) => {
                  const num = parseInt(e.target.value);
                  setSpeed(Number.isNaN(num) ? '' : num);
               }}
            />
         </div>
         <Canvas
            height={200}
            width={width}
            draw={weirdMode ? weirdDraw : normalDraw}
         />
      </>
   );
};
