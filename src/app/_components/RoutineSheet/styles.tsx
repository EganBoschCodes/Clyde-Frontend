import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const GroupTitle = styled.h3`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.textMuted};
`;

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Option = styled.button<{ $isCurrent: boolean }>`
  min-height: ${theme.size.touch};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  border: 1px solid ${({ $isCurrent }) => ($isCurrent ? theme.colors.text : theme.colors.borderSubtle)};
  background: ${({ $isCurrent }) => ($isCurrent ? theme.colors.accentSoft : theme.colors.surfaceRaised)};
  color: ${theme.colors.text};
  font: inherit;
  font-size: ${theme.fontSize.base};
  font-weight: ${({ $isCurrent }) => ($isCurrent ? theme.fontWeight.semibold : theme.fontWeight.medium)};
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: ${theme.colors.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const Check = styled.span`
  font-weight: ${theme.fontWeight.bold};
`;
