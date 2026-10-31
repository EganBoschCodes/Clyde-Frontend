import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Top = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

export const Label = styled.label`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
`;

export const Readout = styled.output`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`;

export const Range = styled.input`
  --pct: 50%;
  width: 100%;
  height: 48px;
  margin: 0;
  background: transparent;
  cursor: pointer;
  touch-action: pan-y;
  -webkit-appearance: none;
  appearance: none;

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
    border-radius: ${theme.radius.md};
  }

  &::-webkit-slider-runnable-track {
    height: 12px;
    border-radius: ${theme.radius.full};
    background: linear-gradient(90deg, ${theme.colors.text} var(--pct), ${theme.colors.surfaceTrack} var(--pct));
  }

  &::-moz-range-track {
    height: 12px;
    border-radius: ${theme.radius.full};
    background: linear-gradient(90deg, ${theme.colors.text} var(--pct), ${theme.colors.surfaceTrack} var(--pct));
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 32px;
    height: 32px;
    margin-top: -10px;
    border-radius: 50%;
    border: 3px solid ${theme.colors.background};
    background: ${theme.colors.text};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }

  &::-moz-range-thumb {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 3px solid ${theme.colors.background};
    background: ${theme.colors.text};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }
`;

export const Ends = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
`;
