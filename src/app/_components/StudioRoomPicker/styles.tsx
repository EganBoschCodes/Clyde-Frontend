import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Group = styled.div`
  display: flex;
  padding: 3px;
  gap: 3px;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.surfaceTrack};
  border: 1px solid ${theme.colors.borderSubtle};
`;

export const Option = styled.label`
  position: relative;
  flex: 1;
  min-width: 0;
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
  align-items: center;
  justify-content: center;
  min-height: ${theme.size.touchSm};
  padding: 0 ${theme.spacing.sm};
  border-radius: 8px;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.textMuted};
  text-align: center;
  transition: background-color 120ms ease, color 120ms ease;

  input:checked + & {
    background: ${theme.colors.surfaceHover};
    color: ${theme.colors.text};
    box-shadow: 0 0 0 1px ${theme.colors.border};
  }

  input:focus-visible + & {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 1px;
  }
`;
