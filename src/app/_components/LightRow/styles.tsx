import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Row = styled.li<{ $isOn: boolean }>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.sm};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${({ $isOn }) => ($isOn ? 'var(--room-glow-border, ' + theme.colors.borderSubtle + ')' : theme.colors.borderSubtle)};
  background:
    ${({ $isOn }) =>
      $isOn
        ? 'radial-gradient(120% 140% at 100% 0%, var(--room-glow-wash, ' + theme.colors.accentSoft + '), transparent 65%),'
        : ''}
    ${theme.colors.surface};
  box-shadow: ${theme.shadow.card};
  transition: border-color 400ms ease, background 400ms ease;
`;

export const Open = styled.button`
  flex: 1 1 0;
  min-width: 0;
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: 0 ${theme.spacing.sm};
  border-radius: ${theme.radius.md};
  border: none;
  background: transparent;
  color: ${theme.colors.text};
  font: inherit;
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

export const Swatch = styled.span<{ $isOn: boolean }>`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ $isOn }) => ($isOn ? 'transparent' : theme.colors.borderStrong)};
  background: ${({ $isOn }) => ($isOn ? 'var(--room-glow, ' + theme.colors.lightDefault + ')' : theme.colors.offFill)};
  box-shadow: ${({ $isOn }) => ($isOn ? '0 0 20px -4px var(--room-glow, ' + theme.colors.lightDefault + ')' : 'none')};
  transition: background-color 200ms ease, box-shadow 200ms ease;
`;

export const Titles = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Name = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
  overflow-wrap: anywhere;
`;

export const Status = styled.span<{ $isPinned: boolean }>`
  font-size: ${theme.fontSize.sm};
  color: ${({ $isPinned }) => ($isPinned ? theme.colors.text : theme.colors.textMuted)};
`;

export const Error = styled.div`
  flex-basis: 100%;
  padding: 0 ${theme.spacing.sm} ${theme.spacing.xs};
`;
