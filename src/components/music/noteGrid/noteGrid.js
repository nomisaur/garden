import React, { useState } from 'react';
import styled from 'styled-components';

import { list, reduceFraction } from '../../../utils';
import { useMusicContext } from '../../../hooks';

import { GridNote } from './gridNote';

const Row = styled.div`
   display: flex;
`;

const GridOptions = styled.div`
   display: flex;
   margin: 5px;
   justify-content: space-between;
   width: 800px;
`;

export const NoteGrid = () => {
   const { audioCtx, masterGain } = useMusicContext();

   const [root, setRoot] = useState(200);
   const [gridSize, setGridSize] = useState(12);
   const [toggleMode, setToggleMode] = useState(false);
   const [longRelease, setLongRelease] = useState(true);
   const [lowerMode, setLowerMode] = useState(false);
   const [notesPlaying, setNotesPlaying] = useState({});

   const realGridSize = Math.min(gridSize || 1, 32);
   const ratios = list(realGridSize, (a) =>
      list(realGridSize, (b) => [b + 1, a + 1]),
   );
   return (
      <div>
         <GridOptions>
            <div>
               root frequency:
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
            </div>
            <div>
               grid size:
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
            </div>
            <div>
               long release:
               <input
                  type='checkbox'
                  checked={longRelease}
                  onChange={(e) => setLongRelease(e.target.checked)}
               />
            </div>
            <div>
               toggle mode:
               <input
                  type='checkbox'
                  checked={toggleMode}
                  onChange={(e) => setToggleMode(e.target.checked)}
               />
            </div>
            <div>
               lower mode:
               <input
                  type='checkbox'
                  checked={lowerMode}
                  onChange={(e) => setLowerMode(e.target.checked)}
               />
            </div>
         </GridOptions>
         {ratios.map((row, i1) => (
            <Row key={i1}>
               {row.map(([top, bottom], i2) => {
                  const ratio = [lowerMode ? top : top + bottom - 1, bottom];
                  const reducedRatio = reduceFraction(ratio);
                  const noteId = `${ratio[0]},${ratio[1]}`;
                  const ratioId = `${reducedRatio[0]},${reducedRatio[1]}`;
                  return (
                     <GridNote
                        key={i2}
                        ratio={ratio}
                        reducedRatio={reducedRatio}
                        noteId={noteId}
                        ratioId={ratioId}
                        audioCtx={audioCtx}
                        masterGain={masterGain}
                        root={root || 1}
                        gridSize={realGridSize}
                        toggleMode={toggleMode}
                        longRelease={longRelease}
                        lowerMode={lowerMode}
                        notesPlaying={notesPlaying}
                        setNotesPlaying={setNotesPlaying}
                     />
                  );
               })}
            </Row>
         ))}
      </div>
   );
};
