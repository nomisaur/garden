import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMusicContext } from '../../../hooks';
import { initialVolume } from '../../../config';

const Slider = styled.div`
   margin: 5px;
`;

const Volume = styled.input``;

export const VolumeSlider = () => {
   const { audioCtx, masterGain } = useMusicContext();
   const [volume, setVolume] = useState(initialVolume);

   useEffect(() => {
      masterGain.gain.linearRampToValueAtTime(
         volume,
         audioCtx.currentTime + 0.05,
      );
   }, [volume]);

   return (
      <Slider>
         volume:
         <Volume
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
         />
      </Slider>
   );
};
