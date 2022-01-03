import { useEffect, useRef } from 'react';

export const PlayNote = ({
   audioCtx,
   frequency,
   envelope: {
      attack = 0.01,
      decay = 0.05,
      sustain = 0.05,
      release = 2,
      peak = 0.1,
   } = {},
}) => {
   const osc = useRef(audioCtx.createOscillator());
   let mountTime = Date.now();

   const decayTime = attack + decay;
   const stopTime = decayTime + release;

   useEffect(() => {
      mountTime = Date.now();
      const startTime = audioCtx.currentTime;
      osc.current.frequency.setValueAtTime(frequency, startTime);

      const gain = audioCtx.createGain();
      osc.current.connect(gain);
      gain.connect(audioCtx.destination);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peak, startTime + attack);
      gain.gain.exponentialRampToValueAtTime(sustain, startTime + decayTime);

      osc.current.start();

      return () => {
         const duration = (Date.now() - mountTime) / 1000 + startTime;
         gain.gain.setValueAtTime(sustain, duration + decayTime);
         gain.gain.exponentialRampToValueAtTime(
            0.00000001,
            duration + stopTime,
         );
         osc.current.stop(duration + stopTime);
         osc.current = audioCtx.createOscillator();
      };
   }, []);

   useEffect(() => {
      const duration = (Date.now() - mountTime) / 1000;
      osc.current.frequency.linearRampToValueAtTime(
         frequency,
         audioCtx.currentTime + 3,
      );
      osc.current.frequency.setValueAtTime(frequency, duration + 3);
   }, [frequency]);
   return null;
};
