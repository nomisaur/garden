import React from 'react';
import { PlanterBox } from '../planterBox';
import { useAppContext } from '../../hooks';

import { addToPayload } from '../../utils/pureUtils';

const Garden = () => {
  const { state, setState } = useAppContext();
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
