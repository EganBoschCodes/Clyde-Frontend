import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const StatusLine = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
`;

export const Mono = styled.span`
  font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;
`;

export const Sep = styled.span`
  color: ${theme.colors.textFaint};
  margin: 0 ${theme.spacing.xs};
`;
