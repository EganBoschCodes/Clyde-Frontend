import styled from 'styled-components';

import { theme } from '@/styles/theme';

const RAINBOW = 'conic-gradient(#ff2d2d, #ffbf47, #3ddc5a, #38b6ff, #9b4dff, #ff5fa2, #ff2d2d)';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const GroupTitle = styled.h3`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.textMuted};
`;

export const Dots = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${theme.size.touchSm}, 1fr));
  gap: ${theme.spacing.sm};
`;

export const Dot = styled.button<{ $isSelected: boolean }>`
  justify-self: center;
  width: ${theme.size.touchSm};
  height: ${theme.size.touchSm};
  padding: 0;
  border-radius: 50%;
  border: 3px solid ${({ $isSelected }) => ($isSelected ? theme.colors.text : theme.colors.surface)};
  outline: 1px solid ${theme.colors.borderStrong};
  outline-offset: -1px;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: transform 120ms ease;

  &:active {
    transform: scale(0.92);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const CustomLabel = styled.label`
  position: relative;
  justify-self: center;
  width: ${theme.size.touchSm};
  height: ${theme.size.touchSm};
  border-radius: 50%;
  overflow: hidden;
  background: ${RAINBOW};
  border: 3px solid ${theme.colors.surface};
  outline: 1px solid ${theme.colors.borderStrong};
  outline-offset: -1px;
  cursor: pointer;

  &:focus-within {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const CustomInput = styled.input`
  position: absolute;
  inset: -8px;
  width: calc(100% + 16px);
  height: calc(100% + 16px);
  padding: 0;
  border: none;
  background: none;
  opacity: 0.01;
  cursor: pointer;
`;

export const Hint = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
`;
