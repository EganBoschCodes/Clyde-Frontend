import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.xs};
`;

export const Row = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const Status = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
`;

export const Error = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.danger};
`;
