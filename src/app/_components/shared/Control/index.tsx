import styled, { css } from 'styled-components';

import { theme } from '@/styles/theme';

type ControlSize = 'sm' | 'md';

interface ControlProps {
  $size?: ControlSize;
}

const controlBase = css<ControlProps>`
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.border};
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: background-color 120ms ease, opacity 120ms ease;

  ${props => {
    const size: ControlSize = props.$size ?? 'md';
    if (size === 'sm') {
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.fontSize.xs};
      `;
    }
    return css`
      padding: ${theme.spacing.xs} ${theme.spacing.md};
      font-size: ${theme.fontSize.sm};
    `;
  }}

  &:hover:not(:disabled) {
    background: ${theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Button = styled.button<ControlProps>`
  ${controlBase}
`;

export const Select = styled.select<ControlProps>`
  ${controlBase}
  appearance: auto;

  & option {
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
  }
`;

export const Input = styled.input<ControlProps>`
  ${controlBase}
  cursor: text;

  &:hover:not(:disabled) {
    background: transparent;
  }
`;

interface ToggleProps {
  $on: boolean;
}

const TOGGLE_TRACK_WIDTH = 36;
const TOGGLE_TRACK_HEIGHT = 20;
const TOGGLE_THUMB_SIZE = 14;
const TOGGLE_THUMB_INSET = (TOGGLE_TRACK_HEIGHT - TOGGLE_THUMB_SIZE) / 2;
const TOGGLE_THUMB_TRAVEL = TOGGLE_TRACK_WIDTH - TOGGLE_THUMB_SIZE - TOGGLE_THUMB_INSET * 2;

export const Toggle = styled.button<ToggleProps>`
  position: relative;
  width: ${TOGGLE_TRACK_WIDTH}px;
  height: ${TOGGLE_TRACK_HEIGHT}px;
  flex-shrink: 0;
  padding: 0;
  border-radius: ${theme.radius.full};
  border: 1px solid ${theme.colors.border};
  background: ${props => (props.$on ? theme.colors.accent : 'transparent')};
  cursor: pointer;
  transition: background-color 120ms ease, opacity 120ms ease;

  &::after {
    content: '';
    position: absolute;
    top: ${TOGGLE_THUMB_INSET - 1}px;
    left: ${TOGGLE_THUMB_INSET - 1}px;
    width: ${TOGGLE_THUMB_SIZE}px;
    height: ${TOGGLE_THUMB_SIZE}px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.text};
    transform: translateX(${props => (props.$on ? `${TOGGLE_THUMB_TRAVEL}px` : '0')});
    transition: transform 140ms ease;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
