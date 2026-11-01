import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

export const PowerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

export const PowerText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const PowerTitle = styled.span`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  letter-spacing: -0.02em;
`;

export const PowerStatus = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

export const PinBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surfaceRaised};
`;

export const PinText = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  line-height: 1.4;
  color: ${theme.colors.textMuted};
`;
