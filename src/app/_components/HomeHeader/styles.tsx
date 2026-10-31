import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Bar = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

export const Title = styled.h1`
  margin: 0;
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  letter-spacing: -0.03em;
  line-height: 1.1;
`;

export const AllOffButton = styled.button`
  min-height: ${theme.size.touchSm};
  padding: 0 ${theme.spacing.xl};
  border-radius: ${theme.radius.full};
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.surfaceRaised};
  color: ${theme.colors.text};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active:not(:disabled) {
    background: ${theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const Error = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.dangerText};
`;
