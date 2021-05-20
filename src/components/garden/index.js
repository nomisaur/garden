import React from 'react';
import { Soil } from '../soil';
import { useAppContext } from '../../hooks';

import { addToPayload } from '../../utils';

const Garden = () => {
  const { state, setState } = useAppContext();
  return (
    <div>
      {state.soils.map((soilState, soilIndex) => {
        return (
          <Soil
            key={soilIndex}
            soilState={soilState}
            setState={addToPayload(setState, { soilIndex })}
          />
        );
      })}
    </div>
  );
};

export { Garden };
