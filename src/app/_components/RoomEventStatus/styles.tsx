import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: 0 ${theme.spacing.xs} 0 ${theme.spacing.md};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.surfaceRaised};
`;

export const Text = styled.p`
  margin: 0;
  min-width: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

export const Name = styled.span`
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeight.semibold};
`;

export const CancelButton = styled.button`
  flex-shrink: 0;
  min-height: ${theme.size.touchSm};
  min-width: ${theme.size.touchSm};
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.dangerBorder};
  background: transparent;
  color: ${theme.colors.dangerText};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

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
