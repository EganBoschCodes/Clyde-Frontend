import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${theme.spacing.sm};

  @media (min-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
`;

export const Tile = styled.button<{ $isSelected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  min-height: ${theme.size.touch};
  padding: 0;
  border-radius: ${theme.radius.lg};
  border: 3px solid ${({ $isSelected }) => ($isSelected ? theme.colors.text : 'transparent')};
  outline: 1px solid ${theme.colors.borderSubtle};
  outline-offset: -1px;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: transform 120ms ease;

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 3px;
  }
`;

export const AddTile = styled.button`
  aspect-ratio: 1;
  min-height: ${theme.size.touch};
  border-radius: ${theme.radius.lg};
  border: 2px dashed ${theme.colors.border};
  background: transparent;
  color: ${theme.colors.textMuted};
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  touch-action: manipulation;

  &:hover:not(:disabled) {
    color: ${theme.colors.text};
    border-color: ${theme.colors.textMuted};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surface};
`;

export const PickerLabel = styled.label`
  position: relative;
  flex: none;
  width: ${theme.size.touch};
  height: ${theme.size.touch};
  border-radius: ${theme.radius.md};
  overflow: hidden;
  border: 2px solid ${theme.colors.border};
  cursor: pointer;

  &:focus-within {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const PickerInput = styled.input`
  position: absolute;
  inset: -8px;
  width: calc(100% + 16px);
  height: calc(100% + 16px);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

export const Hex = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  font-family: var(--font-geist-mono), monospace;
  font-size: ${theme.fontSize.sm};
  text-transform: uppercase;
`;

export const HexHint = styled.span`
  font-family: var(--font-geist-sans), sans-serif;
  font-size: ${theme.fontSize.xs};
  text-transform: none;
  color: ${theme.colors.textFaint};
`;

export const IconButton = styled.button`
  flex: none;
  width: ${theme.size.touch};
  height: ${theme.size.touch};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surfaceRaised};
  color: ${theme.colors.text};
  font-size: 18px;
  cursor: pointer;
  touch-action: manipulation;

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const DangerIconButton = styled(IconButton)`
  color: ${theme.colors.dangerText};
  border-color: ${theme.colors.dangerBorder};
`;

export const QuickRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

export const QuickDot = styled.button`
  position: relative;
  width: ${theme.size.touchSm};
  height: ${theme.size.touchSm};
  padding: 0;
  border-radius: 50%;
  border: 2px solid ${theme.colors.background};
  outline: 1px solid ${theme.colors.borderSubtle};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.92);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const QuickLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
`;
