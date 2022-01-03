import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Fraction } from '../styled/fractions';

import { list } from '../../utils';

const displayNumber = (num) => {
   const string = num.toFixed(1);
   const [whole, decimal] = string.split('.');
   return decimal === '0' ? whole : string;
};

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const reduceFraction = ([a, b]) => {
   const reducer = gcd(a, b);
   return [a / reducer, b / reducer];
};

const PlayNote = ({ frequency, audioCtx }) => {
   useEffect(() => {
      const osc = audioCtx.createOscillator();
      osc.frequency.value = frequency;

      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);

      osc.start();

      return () => {
         gain.gain.exponentialRampToValueAtTime(0.00001, 0);
         osc.stop(0);
      };
   }, []);
   return null;
};

const Row = styled.div`
   display: flex;
`;

const Box = styled.div.attrs(({ isOn = false, ab = [1, 1], gridSize }) => {
   const [a, b] = ab
      .map((n) => n - 1)
      .map((n) => parseInt(((n / gridSize) * 16).toFixed(0)).toString(16));
   return {
      style: {
         background: isOn ? '#151' : `#${b}0${a}`,
      },
   };
})`
   width: 80px;
   height: 80px;
   font-size: 12px;
   border: 1px solid white;
   margin: 2px;
   display: flex;

   flex-direction: column;
   justify-content: space-between;
   //justify-content: center;
   //align-items: center;
`;

const Top = styled.div`
   display: flex;
   justify-content: center;
   font-size: 18px;
   //align-self: center;
`;
const Bottom = styled.div`
   margin-right: 4px;
   display: flex;
   justify-content: flex-end;
   //align-self: flex-end;
   //display: flex;
   //justify-content: center;
   //align-items: center;
`;

const Note = ({ root, top, bottom, audioCtx, gridSize }) => {
   const [on, setOn] = useState(false);
   const frequency = (root * top) / bottom;

   return (
      <Box
         isOn={on}
         ab={reduceFraction([top, bottom])}
         gridSize={gridSize}
         onClick={() => setOn(!on)}
      >
         <div>&nbsp;</div>
         <Top>
            <Fraction top={top} bottom={bottom} />
            {/* <div>{displayNumber(frequency)}</div> */}
         </Top>
         <Bottom>{displayNumber(frequency)}</Bottom>
         {on && <PlayNote frequency={frequency} audioCtx={audioCtx} />}
      </Box>
   );
};

const NoteRow = ({ row, audioCtx, root, gridSize }) => {
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
            />
         ))}
      </Row>
   );
};

export const Notes = () => {
   const audioCtx = new AudioContext();
   const [root, setRoot] = useState(200);
   const gridSize = 12;
   const ratios = list(gridSize, (a) => list(gridSize, (b) => [b + 1, a + 1]));
   return (
      <>
         <input
            type='text'
            value={root}
            onChange={(e) => setRoot(e.target.value)}
         ></input>
         {ratios.map((row, i) => (
            <NoteRow
               key={i}
               root={root}
               row={row}
               audioCtx={audioCtx}
               gridSize={gridSize}
            />
         ))}
      </>
   );
};
