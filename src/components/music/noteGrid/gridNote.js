import React, { useEffect, useState } from 'react';

import { NoteBox } from '../noteBox/noteBox';

export const GridNote = ({
   root,
   ratio,
   reducedRatio,
   noteId,
   ratioId,
   gridSize,
   toggleMode,
   longRelease,
   lowerMode,
   setNotesPlaying,
   notesPlaying,
}) => {
   const [playing, setPlaying_] = useState(false);
   const [color, setColor] = useState('#000000');

   const sympathy = Object.values(notesPlaying[ratioId] || {}).some((x) => x);

   const setPlaying = (play) => {
      setPlaying_(play);
      setNotesPlaying({
         ...notesPlaying,
         [ratioId]: {
            ...(notesPlaying[ratioId] || {}),
            [noteId]: play,
         },
      });
   };

   useEffect(() => {
      setPlaying(false);
      setNotesPlaying({});
   }, [toggleMode]);

   useEffect(() => {
      const [top, bottom] = reducedRatio.map((n) => n - 1);
      const blue = parseInt(
         (255 - ((lowerMode ? top : top - bottom) / gridSize) * 255).toFixed(0),
      );
      const red = parseInt((255 - (bottom / gridSize) * 255).toFixed(0));
      setColor(playing ? [0, 192, 0] : sympathy ? [0, 96, 0] : [blue, 0, red]);
   }, [...reducedRatio, gridSize, playing, lowerMode, sympathy]);

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
