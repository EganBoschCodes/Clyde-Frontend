import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Title = styled.h1`
  margin: 0;
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  letter-spacing: -0.03em;
`;

export const RetryButton = styled.button`
  align-self: flex-start;
  min-height: ${theme.size.touch};
  padding: 0 ${theme.spacing.xl};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.surfaceRaised};
  color: ${theme.colors.text};
  font: inherit;
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
`;
