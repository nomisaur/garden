import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Fraction } from '../styled/fractions';

import { list } from '../../utils';

const Box = styled.div`
   width: 80px;
   height: 80px;
   border: 1px solid white;
   margin: 2px;
   display: flex;
   justify-content: center;
   align-items: center;
   background: ${({ isOn = false, ab: [a = 1, b = 1] = [] }) =>
      isOn ? '#151' : `#${(a - 1).toString(16)}0${(b - 1).toString(16)}`};
`;

const Row = styled.div`
   display: flex;
`;

const displayNumber = (num) => {
   const string = num.toFixed(2);
   const [whole, decimal] = string.split('.');
   return decimal === '00' ? whole : string;
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

const Note = ({ root, top, bottom, audioCtx }) => {
   const [on, setOn] = useState(false);
   const frequency = (root * bottom) / top;

   return (
      <Box
         isOn={on}
         ab={reduceFraction([top, bottom])}
         onClick={() => setOn(!on)}
      >
         <div>
            <Fraction top={top} bottom={bottom} />
            <div>{displayNumber(frequency)}</div>
         </div>
         {on && <PlayNote frequency={frequency} audioCtx={audioCtx} />}
      </Box>
   );
};

const ratios = list(16, (a) => list(16, (b) => [a + 1, b + 1]));

const NoteRow = ({ row, audioCtx, root }) => {
   return (
      <Row>
         {row.map(([top, bottom], i) => (
            <Note
               key={i}
               audioCtx={audioCtx}
               root={root}
               top={top}
               bottom={bottom}
            />
         ))}
      </Row>
   );
};

export const Notes = () => {
   const audioCtx = new AudioContext();
   const [root, setRoot] = useState(200);
   return (
      <>
         <input
            type='text'
            value={root}
            onChange={(e) => setRoot(e.target.value)}
         ></input>
         {ratios.map((row, i) => (
            <NoteRow key={i} root={root} row={row} audioCtx={audioCtx} />
         ))}
      </>
   );
};
