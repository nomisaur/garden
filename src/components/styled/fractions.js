import React from 'react';
import styled from 'styled-components';

const Frac = styled.div`
   display: inline-block;
   position: relative;
   vertical-align: middle;
   letter-spacing: 0.001em;
   text-align: center;
`;

const Top = styled.span`
   display: block;
   padding: 0.1em;
`;
const Bottom = styled.span`
   display: block;
   padding: 0.1em;
   border-top: thin solid white;
`;
const Symbol = styled.span`
   display: block;
   padding: 0.1em;
   display: none;
`;

export const Fraction = ({ top = 1, bottom = 1 }) => (
   <Frac>
      <Top>{top}</Top>
      <Symbol>/</Symbol>
      <Bottom>{bottom}</Bottom>
   </Frac>
);
