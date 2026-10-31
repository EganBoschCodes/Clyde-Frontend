import styled, { css } from 'styled-components';

import { theme } from '@/styles/theme';

export const screenStyles = css`
  flex: 1;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
`;

export const mainStyles = css<{ $isWide: boolean }>`
  margin: 0 auto;
  width: 100%;
  max-width: ${({ $isWide }) => ($isWide ? theme.maxWidth.wide : theme.maxWidth.main)};
  padding: max(${theme.spacing.lg}, env(safe-area-inset-top, 0px)) ${theme.spacing.lg}
    calc(${theme.size.tabBar} + env(safe-area-inset-bottom, 0px) + ${theme.spacing.xl});
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};

  @media (min-width: ${theme.breakpoint.tablet}) {
    padding: ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.xxl};
    gap: ${theme.spacing.xl};
  }
`;

export const Screen = styled.div`
  ${screenStyles}
`;

export const Main = styled.main<{ $isWide: boolean }>`
  ${mainStyles}
`;
