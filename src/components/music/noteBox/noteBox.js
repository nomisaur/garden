import React, { useState } from 'react';

import { Fraction } from '../../styled/fractions';

import { displayNumber } from '../../../utils';

import { PlayNote } from '../playNote';

import {
   NoteBoxContainer,
   KeyBox,
   NoteFraction,
   NoteFrequency,
   Volume,
   VolumeBox,
} from './noteStyles';

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
      <NoteBoxContainer>
         <VolumeBox>
            <Volume
               type='range'
               min='0'
               max='1'
               step='0.05'
               value={volume}
               color={volumeColor}
               onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
         </VolumeBox>
         <KeyBox
            color={keyColor}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
         >
            <div>&nbsp;</div>
            <NoteFraction>
               <Fraction top={top} bottom={bottom} />
            </NoteFraction>
            <NoteFrequency>{displayNumber(frequency)}</NoteFrequency>

            <PlayNote
               playing={playing}
               frequency={frequency}
               volume={volume}
               {...props}
            />
         </KeyBox>
      </NoteBoxContainer>
   );
};
