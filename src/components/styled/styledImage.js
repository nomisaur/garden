import styled from 'styled-components';

export const StyledImage = styled.p`
   color: ${({ color = '#fff' }) => color};
   font-size: xxx-large;
   white-space: pre;
   line-height: ${({ lineHeight = 1 }) => lineHeight};
   margin-bottom: ${({ marginBottom = 'auto' }) => marginBottom};
   margin-top: ${({ marginTop = 'auto' }) => marginTop};
`;
