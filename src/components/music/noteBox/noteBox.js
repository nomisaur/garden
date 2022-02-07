import React, { useState } from 'react';
import styled from 'styled-components';

import { Fraction } from '../../styled/fractions';

import { displayNumber } from '../../../utils';

import { PlayNote } from '../playNote';

const Box = styled.div`
   width: 80px;
   height: 80px;
   margin: 2px;
   position: relative;
`;

const Key = styled.div.attrs(({ color }) => {
   return {
      style: {
         background: color,
      },
   };
})`
   width: 80px;
   height: 80px;
   font-size: 12px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   margin: 0;
   padding: 0;
   position: absolute;
`;

const Top = styled.div`
   display: flex;
   justify-content: center;
   font-size: 18px;
`;
const Bottom = styled.div`
   margin-right: 4px;
   display: flex;
   justify-content: flex-end;
`;

const Volume = styled.input.attrs(({ color }) => ({
   style: {
      background: color,
   },
}))`
   -webkit-appearance: none;
   transform-origin: bottom left;
   transform: translate(10px, 66px) rotate(270deg);
   height: 10px;
   width: 80px;
   margin: 0;
   padding: 0;

   ::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      height: 10px;
      width: 80px;
   }

   ::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 10px;
      width: 10px;
      background: #fff;
   }
`;
const VolumeBox = styled.div`
   position: absolute;
   height: 80px;
   width: 10px;
   z-index: 1;
`;

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
