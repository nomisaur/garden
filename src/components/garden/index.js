import React from 'react';
import { PlanterBox } from '../planterBox';

import { addToPayload } from '../../utils/pureUtils';

const Garden = ({ state, setState }) => {
  return (
    <div>
      {state.planterBoxes.map((planterBoxState, planterBoxIndex) => {
        return (
          planterBoxState.unlocked && (
            <PlanterBox
              key={planterBoxIndex}
              planterBoxState={planterBoxState}
              setState={addToPayload(setState, { planterBoxIndex })}
            />
          )
        );
      })}
    </div>
  );
};

export { Garden };
