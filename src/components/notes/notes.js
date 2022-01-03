import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Fraction } from '../styled/fractions';

import { list } from '../../utils';

const Box = styled.div.attrs(({ isOn = false, ab = [1, 1], size }) => {
   const [a, b] = ab
      .map((n) => n - 1)
      .map((n) => parseInt(((n / size) * 16).toFixed(0)).toString(16));
   return {
      style: {
         background: isOn ? '#151' : `#${b}0${a}`,
      },
   };
})`
   width: 40px;
   height: 40px;
   font-size: 10px;
   border: 1px solid white;
   margin: 2px;
   display: flex;
   justify-content: center;
   align-items: center;
`;

const Row = styled.div`
   display: flex;
`;

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

const Note = ({ root, top, bottom, audioCtx, size }) => {
   const [on, setOn] = useState(false);
   const frequency = (root * top) / bottom;

   return (
      <Box
         isOn={on}
         ab={reduceFraction([top, bottom])}
         size={size}
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

const NoteRow = ({ row, audioCtx, root, size }) => {
   return (
      <Row>
         {row.map(([top, bottom], i) => (
            <Note
               key={i}
               audioCtx={audioCtx}
               root={root}
               top={top}
               bottom={bottom}
               size={size}
            />
         ))}
      </Row>
   );
};

export const Notes = () => {
   const audioCtx = new AudioContext();
   const [root, setRoot] = useState(200);
   const size = 24;
   const ratios = list(size, (a) => list(size, (b) => [b + 1, a + 1]));
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
               size={size}
            />
         ))}
      </>
   );
};
