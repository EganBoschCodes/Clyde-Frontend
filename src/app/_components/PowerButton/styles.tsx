import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Button = styled.button<{ $isOn: boolean }>`
  flex-shrink: 0;
  width: ${theme.size.power};
  height: ${theme.size.power};
  display: grid;
  place-items: center;
  padding: 0;
  border-radius: ${theme.radius.full};
  border: 1px solid ${({ $isOn }) => ($isOn ? 'transparent' : theme.colors.borderSubtle)};
  background: ${({ $isOn }) => ($isOn ? 'var(--room-glow, ' + theme.colors.accent + ')' : theme.colors.surfaceTrack)};
  color: ${({ $isOn }) => ($isOn ? theme.colors.onAccent : theme.colors.textMuted)};
  box-shadow: ${({ $isOn }) => ($isOn ? '0 0 28px -4px var(--room-glow, ' + theme.colors.accent + ')' : 'none')};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 200ms ease, box-shadow 200ms ease, transform 120ms ease;

  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  & svg {
    filter: ${({ $isOn }) => ($isOn ? 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5))' : 'none')};
  }
`;
