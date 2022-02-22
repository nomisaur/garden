import React, { useState, useEffect } from 'react';
import { MusicContext, useAppContext } from '../../hooks';
import { isDev } from '../../config';

import { NoteGrid } from './noteGrid';
import { VolumeSlider } from './volumeSlider';
import { Visualizer } from './visualizer';

export const Music = () => {
   const { hasInteracted } = useAppContext();
   const [audioCtx] = useState(new AudioContext());
   const [masterGain] = useState(audioCtx.createGain());
   const [analyser] = useState(audioCtx.createAnalyser());

   useEffect(() => {
      analyser.fftSize = 2048;
      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);
   }, []);

   return hasInteracted || isDev ? (
      <MusicContext.Provider value={{ audioCtx, masterGain, analyser }}>
         <Visualizer />
         <VolumeSlider />
         <NoteGrid />
      </MusicContext.Provider>
   ) : (
      <div>please click to allow sound</div>
   );
};
