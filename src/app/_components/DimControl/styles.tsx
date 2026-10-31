import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const Track = styled.div`
  position: relative;
  height: ${theme.size.dimTrack};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.surfaceTrack};
  overflow: hidden;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-y;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px ${theme.colors.accentText};
  }

  &:active {
    cursor: grabbing;
  }
`;

export const Fill = styled.div`
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: ${theme.radius.full};
  background: var(--room-glow, ${theme.colors.accent});
  opacity: 0.9;
  pointer-events: none;
`;

export const Readout = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.xl};
  pointer-events: none;
  color: ${theme.colors.onAccent};
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.55);
`;

export const ReadoutLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`;

export const ReadoutValue = styled.span`
  font-size: ${theme.fontSize.stat};
  font-weight: ${theme.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
`;

export const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: ${theme.spacing.sm};
`;

export const StepButton = styled.button<{ $active?: boolean }>`
  min-height: ${theme.size.touchSm};
  min-width: 0;
  padding: 0;
  border-radius: ${theme.radius.md};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.accent : theme.colors.borderSubtle)};
  background: ${({ $active }) => ($active ? theme.colors.accentSoft : theme.colors.surfaceRaised)};
  color: ${({ $active }) => ($active ? theme.colors.accentText : theme.colors.text)};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 120ms ease, transform 120ms ease;

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
