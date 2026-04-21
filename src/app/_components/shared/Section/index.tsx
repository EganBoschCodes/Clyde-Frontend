import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const SectionHeading = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textFaint};
  font-weight: ${theme.fontWeight.medium};
`;

export const MutedText = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSize.sm};
`;

export const FaintText = styled.p`
  margin: 0;
  color: ${theme.colors.textFaint};
  font-size: ${theme.fontSize.sm};
`;

export const ErrorBanner = styled.p`
  margin: 0;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.dangerBorder};
  background: ${theme.colors.dangerBg};
  color: ${theme.colors.dangerText};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSize.sm};
`;

export const ErrorText = styled.p`
  margin: 0;
  color: ${theme.colors.dangerText};
  font-size: ${theme.fontSize.xs};
`;
