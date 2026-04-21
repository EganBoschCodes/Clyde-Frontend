import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxl};
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: ${theme.spacing.md};
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
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
