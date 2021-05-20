import React from 'react';
import { Plant } from '../plant';
import { soilModels } from '../../models';
import { useAppContext } from '../../hooks';

import styled from 'styled-components';

const SoilDiv = styled.div`
  color: brown;
  font-size: xx-large;
  font-family: monospace;
  white-space: pre;
  width: fit-content;
  block-size: fit-content;
`;

const Soil = ({ soilState, setState }) => {
  const { currentTime } = useAppContext();
  const { plant: plantState, empty, type, waterLevel } = soilState;
  const { image } = soilModels[type];

  const onClick = () => {
    empty && setState('plant', { type: 'pennyPlant' });
  };

  return (
    <>
      <SoilDiv onClick={onClick}>
        {empty ? image : <Plant plantState={plantState} setState={setState} />}
      </SoilDiv>
      <div>soil water level: {waterLevel}</div>
      <button onClick={() => setState('water', { currentTime })}>water</button>
    </>
  );
};

export { Soil };
