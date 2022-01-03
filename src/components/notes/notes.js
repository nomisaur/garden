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
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      osc.frequency.setValueAtTime(frequency, now);

      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const attackLevel = 0.1;
      const sustainLevel = 0.05;

      const attackTime = 0.01;
      const decayTime = 0.05;
      const sustainTime = 0.1;
      const releaseTime = 15;

      const peak = now + attackTime;
      const valley = peak + decayTime;
      const body = valley + sustainTime;
      const tail = body + releaseTime;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(attackLevel, peak);
      gain.gain.exponentialRampToValueAtTime(sustainLevel, valley);
      gain.gain.setValueAtTime(sustainLevel, body);
      gain.gain.exponentialRampToValueAtTime(0.00000001, tail);

      osc.start();
      osc.stop(tail);
   }, []);
   return null;
};

const Row = styled.div`
   display: flex;
`;

const Box = styled.div.attrs(({ isOn = false, ab = [1, 1], gridSize }) => {
   const [a, b] = ab
      .map((n) => n - 1)
      .map((n) => parseInt(15 - ((n / gridSize) * 16).toFixed(0)).toString(16));
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

const Note = ({ root, top, bottom, audioCtx, gridSize }) => {
   const [on, setOn] = useState(false);
   const frequency = (root * top) / bottom;

   return (
      <Box
         isOn={on}
         ab={reduceFraction([top, bottom])}
         gridSize={gridSize}
         onClick={() => {
            setOn(!on);
            setTimeout(() => setOn(false), 150);
         }}
      >
         <div>&nbsp;</div>
         <Top>
            <Fraction top={top} bottom={bottom} />
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
   const [gridSize, setGridSize] = useState(12);
   const ratios = list(gridSize || 1, (a) =>
      list(gridSize || 1, (b) => [b + 1, a + 1]),
   );
   return (
      <>
         <input
            type='text'
            value={root}
            onChange={(e) => {
               const num = parseInt(e.target.value);
               setRoot(Number.isNaN(num) ? '' : num);
            }}
         ></input>
         <input
            type='text'
            value={gridSize}
            onChange={(e) => {
               const num = parseInt(e.target.value);
               setGridSize(Number.isNaN(num) ? '' : num);
            }}
         ></input>
         {ratios.map((row, i) => (
            <NoteRow
               key={i}
               root={root || 1}
               row={row}
               audioCtx={audioCtx}
               gridSize={gridSize || 1}
            />
         ))}
      </>
   );
};
