import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Svg = styled.svg`
  width: 100%;
  height: auto;
  max-width: 720px;
  stroke: ${theme.colors.text};
  fill: none;
`;
