import styled from 'styled-components';

export const Box = styled.div`
   width: 80px;
   height: 80px;
   margin: 2px;
   position: relative;
`;

export const VolumeBox = styled.div`
   position: absolute;
   height: 80px;
   width: 10px;
   z-index: 1;
`;

export const Key = styled.div.attrs(({ color }) => {
   return {
      style: {
         background: color,
      },
   };
})`
   width: 80px;
   height: 80px;
   font-size: 12px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   margin: 0;
   padding: 0;
   position: absolute;
`;

export const Top = styled.div`
   display: flex;
   justify-content: center;
   font-size: 18px;
`;
export const Bottom = styled.div`
   margin-right: 4px;
   display: flex;
   justify-content: flex-end;
`;

export const Volume = styled.input.attrs(({ color }) => ({
   style: {
      background: color,
   },
}))`
   -webkit-appearance: none;
   transform-origin: bottom left;
   transform: translate(10px, 66px) rotate(270deg);
   height: 10px;
   width: 80px;
   margin: 0;
   padding: 0;

   ::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      height: 10px;
      width: 80px;
   }

   ::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 10px;
      width: 10px;
      background: #fff;
   }
`;
