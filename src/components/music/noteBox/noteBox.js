import React from 'react';
import styled from 'styled-components';

import { Fraction } from '../../styled/fractions';

import { displayNumber } from '../../../utils';

import { PlayNote } from '../playNote';

const Box = styled.div.attrs(({ color }) => {
   return {
      style: {
         background: color,
      },
   };
})`
   width: 80px;
   height: 80px;
   font-size: 12px;
   margin: 2px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
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

export const NoteBox = ({
   playing,
   root,
   ratio: [top, bottom] = [],
   color,
   toggleMode = false,
   longRelease = true,
   ...props
}) => {
   const frequency = (root * top) / bottom;

   return (
      <Box color={color} {...props}>
         <div>&nbsp;</div>
         <Top>
            <Fraction top={top} bottom={bottom} />
         </Top>
         <Bottom>{displayNumber(frequency)}</Bottom>

         <PlayNote
            playing={playing}
            frequency={frequency}
            envelope={{ release: longRelease ? 15 : 2 }}
            {...props}
         />
      </Box>
   );
};
