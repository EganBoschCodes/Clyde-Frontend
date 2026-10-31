import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.xl};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadow.card};
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${theme.spacing.md};

  @media (min-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
  min-width: 0;

  & > select,
  & > input {
    width: 100%;
    min-width: 0;
  }
`;

export const DaysField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

export const DaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${theme.spacing.xs};
`;

export const DayToggle = styled.button<{ $active: boolean }>`
  min-width: 0;
  min-height: ${theme.size.touch};
  padding: 0;
  border-radius: ${theme.radius.md};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.accent : theme.colors.borderSubtle)};
  background: ${({ $active }) => ($active ? theme.colors.accentSoft : theme.colors.surfaceRaised)};
  color: ${({ $active }) => ($active ? theme.colors.accentText : theme.colors.textMuted)};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.spacing.md};

  @media (min-width: ${theme.breakpoint.tablet}) {
    display: flex;
    justify-content: flex-end;
  }
`;

export const RowError = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.dangerText};
`;

export const FormError = styled.p`
  margin: 0;
  width: 100%;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.dangerText};
`;

export const FormStatus = styled.p`
  margin: 0;
  width: 100%;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;
