import { useRef } from 'react';
import { useDidMountEffect, useMusicContext } from '../../../hooks';

export const PlayNote = ({
   playing,
   frequency,
   volume = 1,
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
   const envGainRef = useRef(false);
   const noteGainRef = useRef(false);

   const decayTime = attack + decay;
   const stopTime = decayTime + release;
   const sustainVolume = sustain || 0.00000001;
   const peakVolume = peak || 0.00000001;
   const noteVolume = volume || 0.00000001;

   useDidMountEffect(() => {
      const stop = () => {
         const osc = oscRef.current;
         const envGain = envGainRef.current;

         envGain.gain.setValueAtTime(
            sustainVolume,
            audioCtx.currentTime + decayTime,
         );
         envGain.gain.exponentialRampToValueAtTime(
            0.00000001,
            audioCtx.currentTime + stopTime,
         );
         osc.stop(audioCtx.currentTime + stopTime);
      };

      if (playing) {
         oscRef.current = audioCtx.createOscillator();
         envGainRef.current = audioCtx.createGain();
         noteGainRef.current = audioCtx.createGain();

         const osc = oscRef.current;
         const envGain = envGainRef.current;
         const noteGain = noteGainRef.current;

         osc.connect(envGain);
         envGain.connect(noteGain);
         noteGain.connect(masterGain);

         noteGain.gain.setValueAtTime(noteVolume, audioCtx.currentTime);
         osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
         envGain.gain.setValueAtTime(0, audioCtx.currentTime);
         envGain.gain.linearRampToValueAtTime(
            peakVolume,
            audioCtx.currentTime + attack,
         );
         envGain.gain.exponentialRampToValueAtTime(
            sustainVolume,
            audioCtx.currentTime + decayTime,
         );

         osc.start(audioCtx.currentTime);
      } else {
         stop();
      }
      return () => playing && stop();
   }, [playing]);

   useDidMountEffect(() => {
      const osc = oscRef.current;
      if (osc.frequency) {
         osc.frequency.linearRampToValueAtTime(
            frequency,
            audioCtx.currentTime + 0.05,
         );
      }
   }, [frequency]);

   useDidMountEffect(() => {
      const noteGain = noteGainRef.current;
      if (noteGain.gain) {
         noteGain.gain.linearRampToValueAtTime(
            noteVolume,
            audioCtx.currentTime + 0.05,
         );
      }
   }, [volume]);

   return null;
};
