import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Button = styled.button<{ $isOn: boolean; $isPending: boolean }>`
  flex-shrink: 0;
  width: ${theme.size.power};
  height: ${theme.size.power};
  display: grid;
  place-items: center;
  padding: 0;
  border-radius: ${theme.radius.full};
  border: 1px solid ${({ $isOn }) => ($isOn ? 'transparent' : theme.colors.borderStrong)};
  background: ${({ $isOn }) => ($isOn ? 'var(--room-glow, ' + theme.colors.lightDefault + ')' : theme.colors.surfaceRaised)};
  color: ${({ $isOn }) => ($isOn ? 'var(--room-glow-ink, ' + theme.colors.lightInkDark + ')' : theme.colors.textMuted)};
  box-shadow: ${({ $isOn }) => ($isOn ? '0 0 28px -4px var(--room-glow, ' + theme.colors.lightDefault + ')' : 'none')};
  opacity: ${({ $isPending }) => ($isPending ? 0.6 : 1)};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 200ms ease, box-shadow 200ms ease, transform 120ms ease, opacity 120ms ease;

  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
