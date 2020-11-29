import React from 'react';
import { Plant } from '../plant';

import styled from 'styled-components';

const soil = `
     
     
     
~~~~~
`;

const PatchDiv = styled.div`
  color: brown;
  font-size: xx-large;
  font-family: monospace;
  white-space: pre;
  width: fit-content;
  block-size: fit-content;
`;

const Patch = ({ patchState, setState }) => {
  const { empty, plant: plantState } = patchState;

  const onClick = () => {
    empty && setState('plant', { type: 'popper' });
  };

  return (
    <PatchDiv onClick={onClick}>
      {empty ? soil : <Plant plantState={plantState} setState={setState} />}
    </PatchDiv>
  );
};

export { Patch };
