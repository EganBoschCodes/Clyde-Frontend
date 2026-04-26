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
