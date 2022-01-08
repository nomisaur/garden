import { useRef } from 'react';
import { useDidMountEffect, useMusicContext } from '../../../hooks';

export const PlayNote = ({
   playing,
   frequency,
   envelope: {
      attack = 0.01,
      decay = 0.05,
      sustain = 0.5,
      release = 2,
      peak = 1,
   } = {},
}) => {
   const { audioCtx, masterGain } = useMusicContext();
   const oscRef = useRef(false);
   const gainRef = useRef(false);

   const decayTime = attack + decay;
   const stopTime = decayTime + release;

   useDidMountEffect(() => {
      const stop = () => {
         const osc = oscRef.current;
         const gain = gainRef.current;

         gain.gain.setValueAtTime(sustain, audioCtx.currentTime + decayTime);
         gain.gain.exponentialRampToValueAtTime(
            0.00000001,
            audioCtx.currentTime + stopTime,
         );
         osc.stop(audioCtx.currentTime + stopTime);
      };

      if (playing) {
         oscRef.current = audioCtx.createOscillator();
         gainRef.current = audioCtx.createGain();
         const osc = oscRef.current;
         const gain = gainRef.current;

         osc.connect(gain);
         gain.connect(masterGain);

         osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
         gain.gain.setValueAtTime(0, audioCtx.currentTime);
         gain.gain.linearRampToValueAtTime(peak, audioCtx.currentTime + attack);
         gain.gain.exponentialRampToValueAtTime(
            sustain,
            audioCtx.currentTime + decayTime,
         );

         osc.start(audioCtx.currentTime);
      } else {
         stop();
      }
      return () => playing && stop();
   }, [playing]);

   useDidMountEffect(() => {
      if (playing) {
         const osc = oscRef.current;
         osc.frequency.linearRampToValueAtTime(
            frequency,
            audioCtx.currentTime + 0.5,
         );
      }
   }, [frequency]);

   return null;
};
