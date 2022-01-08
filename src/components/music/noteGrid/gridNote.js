import React, { useEffect, useState } from 'react';

import { reduceFraction } from '../../../utils';

import { NoteBox } from '../noteBox/noteBox';

export const GridNote = ({
   root,
   ratio,
   gridSize,
   toggleMode,
   longRelease,
   upperMode,
}) => {
   const [playing, setPlaying] = useState(false);
   const [color, setColor] = useState('#000000');

   useEffect(() => {
      setPlaying(false);
   }, [toggleMode]);

   useEffect(() => {
      const [top, bottom] = reduceFraction(ratio).map((n) => n - 1);
      const blue = parseInt(
         (255 - ((upperMode ? top - bottom : top) / gridSize) * 255).toFixed(0),
      ).toString(16);
      const red = parseInt(
         (255 - (bottom / gridSize) * 255).toFixed(0),
      ).toString(16);
      setColor(playing ? '#080' : `#${blue}00${red}`);
   }, [...ratio, gridSize, playing, upperMode]);

   return (
      <NoteBox
         playing={playing}
         root={root}
         ratio={ratio}
         color={color}
         onMouseDown={() => setPlaying(!playing)}
         onMouseUp={() => !toggleMode && setPlaying(false)}
         envelope={{ release: longRelease ? 15 : 2 }}
      />
   );
};
