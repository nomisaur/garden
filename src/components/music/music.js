import React, { useRef, useEffect } from 'react';
import { MusicContext, useAppContext } from '../../hooks';
import { config } from '../../config';

import { NoteGrid } from './noteGrid';
import { VolumeSlider } from './volumeSlider';

export const Music = () => {
   const { hasInteracted } = useAppContext();
   const audioCtx = useRef(new AudioContext()).current;
   const masterGain = useRef(audioCtx.createGain()).current;

   useEffect(() => {
      masterGain.connect(audioCtx.destination);
   }, []);

   return hasInteracted || config.isDev ? (
      <MusicContext.Provider value={{ audioCtx, masterGain }}>
         <VolumeSlider />
         <NoteGrid />
      </MusicContext.Provider>
   ) : (
      <div>please click to allow sound</div>
   );
};
