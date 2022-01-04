import React, { useState, useRef } from 'react';
import { useCountEffect, MusicContext } from '../../hooks';

import { Notes } from './notes';

export const Music = () => {
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
   return (
      <MusicContext.Provider value={{ audioCtx, masterGain }}>
         <div>
            volume:
            <input
               type='range'
               min='0'
               max='1'
               step='0.05'
               value={volume}
               onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
         </div>
         <Notes />
      </MusicContext.Provider>
   );
};
