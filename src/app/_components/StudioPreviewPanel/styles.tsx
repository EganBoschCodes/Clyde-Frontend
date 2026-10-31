import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surface};
`;

export const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  font-size: ${theme.fontSize.sm};
`;

export const Live = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text};
`;

export const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.text};
  animation: studioBlink 1.4s ease-in-out infinite;

  @keyframes studioBlink {
    50% { opacity: 0.25; }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Hint = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;
