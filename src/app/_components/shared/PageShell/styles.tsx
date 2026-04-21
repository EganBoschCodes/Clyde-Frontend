import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Screen = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
`;

export const Main = styled.main`
  margin: 0 auto;
  max-width: ${theme.maxWidth.main};
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxl};
`;
