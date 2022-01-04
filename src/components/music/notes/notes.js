import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Fraction } from '../../styled/fractions';

import { list, displayNumber, reduceFraction } from '../../../utils';
import { useMusicContext } from '../../../hooks';

import { PlayNote } from '../playNote';

const Row = styled.div`
   display: flex;
`;

const Box = styled.div.attrs(({ color }) => ({
   style: {
      background: color,
   },
}))`
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

const NoteBox = ({
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

const GridNote = ({ root, ratio, gridSize, toggleMode, longRelease }) => {
   const [playing, setPlaying] = useState(false);
   const [color, setColor] = useState('#000');

   useEffect(() => {
      setPlaying(false);
   }, [toggleMode]);

   useEffect(() => {
      const [blue, red] = reduceFraction(ratio)
         .map((n) => n - 1)
         .map((n) =>
            parseInt((15 - (n / gridSize) * 15).toFixed(0)).toString(16),
         );
      setColor(playing ? '#080' : `#${blue}0${red}`);
   }, [...ratio, gridSize, playing]);

   return (
      <NoteBox
         playing={playing}
         root={root}
         ratio={ratio}
         color={color}
         onMouseDown={() => {
            setPlaying(!playing);
         }}
         onMouseUp={() => !toggleMode && setPlaying(false)}
         envelope={{ release: longRelease ? 15 : 2 }}
      />
   );
};

const NoteRow = ({ row, props }) => (
   <Row>
      {row.map((ratio, i) => (
         <GridNote key={i} ratio={ratio} {...props} />
      ))}
   </Row>
);

export const Notes = () => {
   const { audioCtx, masterGain } = useMusicContext();

   const [root, setRoot] = useState(200);
   const [gridSize, setGridSize] = useState(12);
   const [toggleMode, setToggleMode] = useState(false);
   const [longRelease, setLongRelease] = useState(true);

   const realGridSize = Math.min(gridSize || 1, 32);
   const ratios = list(realGridSize, (a) =>
      list(realGridSize, (b) => [b + 1, a + 1]),
   );
   return (
      <div>
         <div>
            <input
               type='number'
               value={root}
               min='1'
               max='2000'
               step='1'
               onChange={(e) => {
                  const num = parseInt(e.target.value);
                  setRoot(Number.isNaN(num) ? '' : num);
               }}
            />
            <input
               type='number'
               value={gridSize}
               min='1'
               max='32'
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
         </div>
         {ratios.map((row, i) => (
            <NoteRow
               key={i}
               row={row}
               props={{
                  audioCtx,
                  masterGain,
                  root: root || 1,
                  gridSize: realGridSize,
                  toggleMode,
                  longRelease,
               }}
            />
         ))}
      </div>
   );
};
