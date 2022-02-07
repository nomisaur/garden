import React, { useState } from 'react';
import styled from 'styled-components';

import { Fraction } from '../../styled/fractions';

import { displayNumber } from '../../../utils';

import { PlayNote } from '../playNote';

import { Box, Key, Top, Bottom, Volume, VolumeBox } from './noteStyles';

const toHexString = (n) => {
   const nString = n.toString(16);
   return nString.length < 2 ? '0' + nString : nString;
};

const toColorString = (r, g, b) => {
   return '#' + toHexString(r) + toHexString(g) + toHexString(b);
};

export const NoteBox = ({
   playing,
   root,
   ratio: [top, bottom] = [],
   color: [red, green, blue] = [],
   onMouseDown,
   onMouseUp,
   ...props
}) => {
   const frequency = (root * top) / bottom;

   const [volume, setVolume] = useState(1);

   const keyColor = toColorString(red, green, blue);
   const volumeColor = toColorString(
      Math.max(0, red - 32),
      green,
      Math.max(0, blue - 32),
   );

   return (
      <Box>
         <VolumeBox>
            <Volume
               type='range'
               orient='vertical'
               min='0'
               max='1'
               step='0.05'
               value={volume}
               color={volumeColor}
               onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
         </VolumeBox>
         <Key color={keyColor} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            <div>&nbsp;</div>
            <Top>
               <Fraction top={top} bottom={bottom} />
            </Top>
            <Bottom>{displayNumber(frequency)}</Bottom>

            <PlayNote
               playing={playing}
               frequency={frequency}
               volume={volume}
               {...props}
            />
         </Key>
      </Box>
   );
};
