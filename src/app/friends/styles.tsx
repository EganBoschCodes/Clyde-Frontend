import styled from 'styled-components';

import { theme } from '@/styles/theme';

const BUTTON_SIZE = 'min(72vw, 288px)';

export const Stage = styled.div`
  flex: 1;
  min-height: 55dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xl};
`;

export const PartyButton = styled.button`
  width: ${BUTTON_SIZE};
  height: ${BUTTON_SIZE};
  border: none;
  border-radius: ${theme.radius.full};
  background: radial-gradient(circle at 30% 25%, ${theme.colors.accentHover}, ${theme.colors.accent} 70%);
  color: ${theme.colors.onAccent};
  font: inherit;
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  letter-spacing: -0.02em;
  box-shadow: ${theme.shadow.glow}, 0 0 0 10px ${theme.colors.accentSoft};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: transform 120ms ease, opacity 120ms ease, filter 120ms ease;

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 3px solid ${theme.colors.accentText};
    outline-offset: 6px;
  }

  &:disabled {
    opacity: 0.55;
    filter: saturate(0.5);
    cursor: not-allowed;
  }
`;

export const StatusText = styled.p`
  margin: 0;
  min-height: 24px;
  text-align: center;
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.textMuted};
`;
