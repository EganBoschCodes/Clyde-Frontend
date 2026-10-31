import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Pill = styled.div`
  position: fixed;
  z-index: ${theme.zIndex.statusBar};
  top: calc(env(safe-area-inset-top, 0px) + ${theme.spacing.sm});
  left: 50%;
  transform: translateX(-50%);
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.full};
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.surfaceRaised};
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSize.xs};
  pointer-events: none;
`;
