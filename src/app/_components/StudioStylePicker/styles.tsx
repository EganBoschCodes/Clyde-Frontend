import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.spacing.sm};

  @media (min-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

export const Tile = styled.label`
  position: relative;
  display: block;
`;

export const Radio = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
`;

export const Face = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm};
  min-height: ${theme.size.touch};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surface};
  transition: border-color 120ms ease, background-color 120ms ease;

  input:checked + & {
    border-color: ${theme.colors.text};
    background: ${theme.colors.surfaceRaised};
  }

  input:focus-visible + & {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const Mini = styled.span`
  display: block;
  height: 44px;
  border-radius: ${theme.radius.md};
  overflow: hidden;
`;

export const Name = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
`;

export const Blurb = styled.span`
  font-size: ${theme.fontSize.xs};
  line-height: 1.35;
  color: ${theme.colors.textMuted};
`;
