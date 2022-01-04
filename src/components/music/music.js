import React, { useState, useRef } from 'react';
import { useCountEffect, MusicContext, useAppContext } from '../../hooks';

import { NoteGrid } from './noteGrid';
import { VolumeSlider } from './volumeSlider';

export const Music = () => {
   const { hasInteracted } = useAppContext();
   const audioCtx = useRef(new AudioContext()).current;
   const masterGain = useRef(audioCtx.createGain()).current;
   const [volume, setVolume] = useState(0.1);

   useCountEffect(
      (count) => {
         !count && masterGain.connect(audioCtx.destination);
         masterGain.gain.linearRampToValueAtTime(
            volume,
            audioCtx.currentTime + 0.2,
         );
      },
      [volume],
   );
   return true ? (
      <MusicContext.Provider value={{ audioCtx, masterGain }}>
         <VolumeSlider volume={volume} setVolume={setVolume} />
         <NoteGrid />
      </MusicContext.Provider>
   ) : (
      <div>please click to allow sound</div>
   );
};
