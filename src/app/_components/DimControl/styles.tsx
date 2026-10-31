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
  border: 1px solid ${theme.colors.borderStrong};
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

export const Fill = styled.div<{ $isOn: boolean }>`
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: ${theme.radius.full};
  background: ${({ $isOn }) => ($isOn ? 'var(--room-glow, ' + theme.colors.lightDefault + ')' : theme.colors.offFill)};
  pointer-events: none;
  transition: background-color 200ms ease;
`;

export const Readout = styled.div<{ $tone: 'base' | 'ink'; $isOn?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.xl};
  pointer-events: none;
  color: ${({ $tone, $isOn }) =>
    $tone === 'base'
      ? theme.colors.text
      : $isOn
        ? 'var(--room-glow-ink, ' + theme.colors.lightInkDark + ')'
        : theme.colors.text};
`;

export const ReadoutLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`;

export const ReadoutValue = styled.span`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
`;

export const Presets = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${theme.spacing.sm};
`;

export const PresetButton = styled.button<{ $active?: boolean }>`
  min-height: ${theme.size.touchSm};
  min-width: 0;
  padding: 0;
  border-radius: ${theme.radius.md};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.text : theme.colors.borderStrong)};
  background: ${({ $active }) => ($active ? theme.colors.accentSoft : theme.colors.surfaceRaised)};
  color: ${theme.colors.text};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  font-weight: ${({ $active }) => ($active ? theme.fontWeight.semibold : theme.fontWeight.medium)};
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 120ms ease, transform 120ms ease;

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;
