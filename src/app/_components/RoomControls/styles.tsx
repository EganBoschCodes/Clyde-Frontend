import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.xs};
`;

export const Row = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const Status = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
`;

export const DimRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  min-width: 180px;
`;

export const DimLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
`;

export const DimSlider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  height: 12px;

  &::-webkit-slider-runnable-track {
    height: 1px;
    background: ${theme.colors.text};
    border: none;
  }

  &::-moz-range-track {
    height: 1px;
    background: ${theme.colors.text};
    border: none;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.text};
    border: none;
    margin-top: -4.5px;
  }

  &::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.text};
    border: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DimValue = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
  font-variant-numeric: tabular-nums;
  min-width: 34px;
  text-align: right;
`;

export const Error = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.danger};
`;
