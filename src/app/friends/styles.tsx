import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Screen = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${theme.spacing.xl};
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xl};
`;

export const PartyButton = styled.button`
  width: 256px;
  height: 256px;
  border: none;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.accent};
  color: #ffffff;
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  box-shadow: 0 25px 50px -12px rgba(192, 38, 211, 0.4);
  cursor: pointer;
  transition: background-color 120ms ease, transform 120ms ease, opacity 120ms ease;

  &:hover:not(:disabled) {
    background: ${theme.colors.accentHover};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const StatusText = styled.p`
  margin: 0;
  height: 20px;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textFaint};
`;
