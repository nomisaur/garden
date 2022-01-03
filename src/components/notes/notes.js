import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import { Fraction } from '../styled/fractions';

import { list, displayNumber, reduceFraction } from '../../utils';

import { PlayNote } from './playNote';

const Row = styled.div`
   display: flex;
`;

const Box = styled.div.attrs(({ isOn = false, ab = [1, 1], gridSize }) => {
   const [a, b] = ab
      .map((n) => n - 1)
      .map((n) => parseInt((15 - (n / gridSize) * 15).toFixed(0)).toString(16));
   return {
      style: {
         background: isOn ? '#080' : `#${b}0${a}`,
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

const Note = ({
   root,
   top,
   bottom,
   audioCtx,
   gridSize,
   toggleMode = false,
   longRelease = true,
}) => {
   const [on, setOn] = useState(false);
   const frequency = (root * top) / bottom;

   useEffect(() => {
      setOn(false);
   }, [toggleMode]);

   return (
      <Box
         isOn={on}
         ab={reduceFraction([top, bottom])}
         gridSize={gridSize}
         onMouseDown={() => setOn(!on)}
         onMouseUp={() => !toggleMode && setOn(false)}
      >
         <div>&nbsp;</div>
         <Top>
            <Fraction top={top} bottom={bottom} />
         </Top>
         <Bottom>{displayNumber(frequency)}</Bottom>
         {on && (
            <PlayNote
               playing={on}
               frequency={frequency}
               audioCtx={audioCtx}
               toggleMode={toggleMode}
               envelope={{ release: longRelease ? 15 : 2 }}
            />
         )}
      </Box>
   );
};

const NoteRow = ({
   row,
   audioCtx,
   root,
   gridSize,
   toggleMode,
   longRelease,
}) => {
   return (
      <Row>
         {row.map(([top, bottom], i) => (
            <Note
               key={i}
               audioCtx={audioCtx}
               root={root}
               top={top}
               bottom={bottom}
               gridSize={gridSize}
               toggleMode={toggleMode}
               longRelease={longRelease}
            />
         ))}
      </Row>
   );
};

export const Notes = () => {
   const audioCtx = new AudioContext();
   const [root, setRoot] = useState(200);
   const [gridSize, setGridSize] = useState(12);
   const realGridSize = Math.min(gridSize || 1, 32);
   const [toggleMode, setToggleMode] = useState(false);
   const [longRelease, setLongRelease] = useState(true);

   const ratios = list(realGridSize, (a) =>
      list(realGridSize, (b) => [b + 1, a + 1]),
   );
   return (
      <div>
         <input
            type='text'
            value={root}
            onChange={(e) => {
               const num = parseInt(e.target.value);
               setRoot(Number.isNaN(num) ? '' : num);
            }}
         />
         <input
            type='text'
            value={gridSize}
            onChange={(e) => {
               const num = parseInt(e.target.value);
               setGridSize(Number.isNaN(num) ? '' : num);
            }}
         />
         long release:
         <input
            type='checkbox'
            checked={longRelease}
            onChange={(e) => setLongRelease(e.target.checked)}
         />
         toggle mode:
         <input
            type='checkbox'
            checked={toggleMode}
            onChange={(e) => setToggleMode(e.target.checked)}
         />
         {ratios.map((row, i) => (
            <NoteRow
               key={i}
               root={root || 1}
               row={row}
               audioCtx={audioCtx}
               gridSize={realGridSize}
               toggleMode={toggleMode}
               longRelease={longRelease}
            />
         ))}
      </div>
   );
};
