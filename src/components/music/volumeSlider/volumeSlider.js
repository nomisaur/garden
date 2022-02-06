import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMusicContext } from '../../../hooks';

const Slider = styled.div`
   margin: 5px;
`;

export const VolumeSlider = () => {
   const { audioCtx, masterGain } = useMusicContext();
   const [volume, setVolume] = useState(0.1);

   useEffect(() => {
      masterGain.gain.linearRampToValueAtTime(
         volume,
         audioCtx.currentTime + 0.2,
      );
   }, [volume]);

   return (
      <Slider>
         volume:
         <input
            type='range'
            min='0'
            max='1'
            step='0.05'
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
         />
      </Slider>
   );
};
