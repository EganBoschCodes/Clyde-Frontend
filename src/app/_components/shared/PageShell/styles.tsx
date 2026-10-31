import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Screen = styled.div`
  flex: 1;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
`;

export const Main = styled.main<{ $isWide: boolean }>`
  margin: 0 auto;
  width: 100%;
  max-width: ${({ $isWide }) => ($isWide ? theme.maxWidth.wide : theme.maxWidth.main)};
  padding: ${theme.spacing.lg} ${theme.spacing.lg}
    calc(${theme.size.tabBar} + env(safe-area-inset-bottom, 0px) + ${theme.spacing.xl});
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};

  @media (min-width: ${theme.breakpoint.tablet}) {
    padding: ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.xxl};
    gap: ${theme.spacing.xl};
  }
`;
