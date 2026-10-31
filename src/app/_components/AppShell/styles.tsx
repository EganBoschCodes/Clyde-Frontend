import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const StatusBarBackdrop = styled.div`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: ${theme.zIndex.statusBar};
  height: env(safe-area-inset-top, 0px);
  background: ${theme.colors.background};
  pointer-events: none;
`;
