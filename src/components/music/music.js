import React, { useState, useEffect } from 'react';
import { MusicContext, useAppContext } from '../../hooks';
import { isDev } from '../../config';

import { NoteGrid } from './noteGrid';
import { VolumeSlider } from './volumeSlider';

export const Music = () => {
   const { hasInteracted } = useAppContext();
   const [audioCtx] = useState(new AudioContext());
   const [masterGain] = useState(audioCtx.createGain());

   useEffect(() => {
      masterGain.connect(audioCtx.destination);
   }, []);

   return hasInteracted || isDev ? (
      <MusicContext.Provider value={{ audioCtx, masterGain }}>
         <VolumeSlider />
         <NoteGrid />
      </MusicContext.Provider>
   ) : (
      <div>please click to allow sound</div>
   );
};
