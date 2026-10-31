import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadow.card};
`;

export const Svg = styled.svg`
  width: 100%;
  height: auto;
  max-width: 720px;
  stroke: ${theme.colors.textMuted};
  fill: none;
`;
