import React from 'react';
import styled from 'styled-components';

const Slider = styled.div`
   margin: 5px;
`;

export const VolumeSlider = ({ volume, setVolume }) => {
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
