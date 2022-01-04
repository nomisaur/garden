import { useRef } from 'react';
import { useDidMountEffect } from './../../../hooks';

export const PlayNote = ({
   playing = false,
   audioCtx,
   masterGain,
   frequency,
   envelope: {
      attack = 0.01,
      decay = 0.05,
      sustain = 0.5,
      release = 2,
      peak = 1,
   } = {},
}) => {
   const oscRef = useRef(false);
   const gainRef = useRef(false);
   const startDateRef = useRef(Date.now());
   const startTimeRef = useRef(audioCtx.currentTime);

   const decayTime = attack + decay;
   const stopTime = decayTime + release;

   useDidMountEffect(() => {
      startTimeRef.current = audioCtx.currentTime;
      const startTime = startTimeRef.current;
      startDateRef.current = Date.now();

      const stop = () => {
         const osc = oscRef.current;
         const gain = gainRef.current;
         const duration =
            (Date.now() - startDateRef.current) / 1000 + startTime;

         gain.gain.setValueAtTime(sustain, duration + decayTime);
         gain.gain.exponentialRampToValueAtTime(
            0.00000001,
            duration + stopTime,
         );
         osc.stop(duration + stopTime);
      };

      if (playing) {
         oscRef.current = audioCtx.createOscillator();
         gainRef.current = audioCtx.createGain();
         const osc = oscRef.current;
         const gain = gainRef.current;

         osc.connect(gain);
         gain.connect(masterGain);

         osc.frequency.setValueAtTime(frequency, startTime);
         gain.gain.setValueAtTime(0, startTime);
         gain.gain.linearRampToValueAtTime(peak, startTime + attack);
         gain.gain.exponentialRampToValueAtTime(sustain, startTime + decayTime);

         osc.start(startTime);
      } else {
         stop();
      }
      return () => playing && stop();
   }, [playing]);

   useDidMountEffect(() => {
      if (playing) {
         const osc = oscRef.current;
         const duration =
            (Date.now() - startDateRef.current) / 1000 + startTimeRef.current;
         osc.frequency.linearRampToValueAtTime(frequency, duration + 0.5);
      }
   }, [frequency]);

   return null;
};
