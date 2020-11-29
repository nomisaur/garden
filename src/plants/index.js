import { time } from '../utils';

const popper = {
  value: 1,
  phases: [
    {
      image: `
     
     
     
~~.~~
`,
      duration: time({ seconds: 3 }),
    },
    {
      image: `
 
 
 
~~^~~
`,
      duration: time({ seconds: 3 }),
    },
    {
      image: `
 
 
  *  
~~^~~
`,
      duration: time({ seconds: 3 }),
    },
    {
      image: `
 
  *
  |
~~^~~
`,
      duration: time({ seconds: 3 }),
    },
    {
      image: `
  *
 ~+~
  |
~~^~~
`,
      duration: time({ seconds: 3 }),
    },
  ],
};

export const plants = { popper };
