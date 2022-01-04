import React, { useEffect, useState } from 'react';

import { reduceFraction } from '../../../utils';

import { NoteBox } from '../noteBox/noteBox';

export const GridNote = ({
   root,
   ratio,
   gridSize,
   toggleMode,
   longRelease,
}) => {
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
