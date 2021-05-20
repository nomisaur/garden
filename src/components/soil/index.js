import React from 'react';
import { Plant } from '../plant';

import styled from 'styled-components';

const soilImg = `
     
     
     
~~~~~
`;

const SoilDiv = styled.div`
  color: brown;
  font-size: xx-large;
  font-family: monospace;
  white-space: pre;
  width: fit-content;
  block-size: fit-content;
`;

const Soil = ({ soilState, setState }) => {
  const { empty, plant: plantState } = soilState;

  const onClick = () => {
    empty && setState('plant', { type: 'pennyPlant' });
  };

  return (
    <SoilDiv onClick={onClick}>
      {empty ? soilImg : <Plant plantState={plantState} setState={setState} />}
    </SoilDiv>
  );
};

export { Soil };
