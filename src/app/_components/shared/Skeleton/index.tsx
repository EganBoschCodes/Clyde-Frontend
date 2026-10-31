import styled, { keyframes } from 'styled-components';

import { theme } from '@/styles/theme';

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

interface SkeletonProps {
  $height: string;
  $radius?: string;
}

export const Skeleton = styled.div<SkeletonProps>`
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius }) => $radius ?? theme.radius.xl};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.borderSubtle};
  animation: ${pulse} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
