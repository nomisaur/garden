import React from 'react';

export const VolumeSlider = ({ volume, setVolume }) => {
   return (
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
   );
};
