import styled, { css } from 'styled-components';

import { theme } from '@/styles/theme';

type ControlTone = 'default' | 'primary' | 'danger';

interface ControlProps {
  $tone?: ControlTone;
}

function toneStyles(tone: ControlTone) {
  if (tone === 'primary') {
    return css`
      background: ${theme.colors.accent};
      border-color: ${theme.colors.accent};
      color: ${theme.colors.onAccent};
    `;
  }
  if (tone === 'danger') {
    return css`
      background: transparent;
      border-color: ${theme.colors.dangerBorder};
      color: ${theme.colors.dangerText};
    `;
  }
  return css`
    background: ${theme.colors.surfaceRaised};
    border-color: ${theme.colors.borderSubtle};
    color: ${theme.colors.text};
  `;
}

const controlBase = css<ControlProps>`
  min-height: ${theme.size.touch};
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  border: 1px solid;
  font: inherit;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 120ms ease, opacity 120ms ease, transform 120ms ease;
  ${props => toneStyles(props.$tone ?? 'default')}

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
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
  text-transform: capitalize;

  & option {
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
  }
`;

export const Input = styled.input<ControlProps>`
  ${controlBase}
  cursor: text;
`;
