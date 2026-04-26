import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxl};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.spacing.sm};
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
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
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
`;

export const DaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${theme.spacing.xs};
`;

export const DayToggle = styled.button<{ $active: boolean }>`
  min-width: 0;
  padding: ${theme.spacing.xs} ${theme.spacing.xs};
  border-radius: ${theme.radius.sm};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.text : theme.colors.border)};
  background: ${({ $active }) => ($active ? theme.colors.text : 'transparent')};
  color: ${({ $active }) => ($active ? theme.colors.background : theme.colors.text)};
  font-size: ${theme.fontSize.xs};
  cursor: pointer;
  transition:
    background 120ms ease,
    color 120ms ease,
    border-color 120ms ease;

  &:hover {
    background: ${({ $active }) => ($active ? theme.colors.textMuted : theme.colors.surfaceHover)};
    border-color: ${({ $active }) => ($active ? theme.colors.textMuted : theme.colors.border)};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

export const RowError = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.danger};
`;

export const FormError = styled.p`
  margin: 0;
  width: 100%;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.danger};
`;

export const FormStatus = styled.p`
  margin: 0;
  width: 100%;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
`;
