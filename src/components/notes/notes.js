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
   background: ${({ background = '#000' }) => background};
`;

const Row = styled.div`
   display: flex;
`;

const AudioContext = window.AudioContext || window.webkitAudioContext;

const nums = list(12, (a) => a + 1).map((a) =>
   list(15, (b) => b + 1)
      .map((b) => [a, b])
      .filter(([a, b]) => b / a >= 1),
);

const decimals = (num) => {
   const string = num.toFixed(2);
   const [whole, decimal] = string.split('.');
   return decimal === '00' ? whole : string;
};

function reduce(numerator, denominator) {
   var gcd = function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
   };
   gcd = gcd(numerator, denominator);
   return [numerator / gcd, denominator / gcd];
}

const Note = ({ root, a, b, osc, toggle }) => {
   const [on, setOn] = useState(false);
   const frequency = (root * b) / a;
   osc.frequency.value = frequency;
   useEffect(() => {
      osc.start();
      return () => osc.stop();
   }, []);

   const [a_, b_] = reduce(a, b);

   return (
      <Box
         background={on ? '#151' : `#${a_.toString(16)}0${b_.toString(16)}`}
         onClick={() => {
            setOn(!on);
            toggle(!on);
         }}
      >
         <div>
            <Fraction top={b} bottom={a} />
            <div>{decimals(frequency)}</div>
         </div>
      </Box>
   );
};

export const Notes = () => {
   const audioCtx = new AudioContext();
   const gainNode = audioCtx.createGain();
   gainNode.connect(audioCtx.destination);
   gainNode.gain.value = 1 / 12;
   return nums.map((row, i1) => (
      <Row key={i1}>
         {row.map(([a, b], i2) => {
            const osc = audioCtx.createOscillator();
            return (
               <Note
                  key={i2}
                  root={200}
                  a={a}
                  b={b}
                  osc={osc}
                  toggle={(on) => {
                     on ? osc.connect(gainNode) : osc.disconnect(0);
                  }}
               />
            );
         })}
      </Row>
   ));
};
