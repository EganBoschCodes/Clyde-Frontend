import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${theme.spacing.md};
  align-items: start;

  @media (min-width: ${theme.breakpoint.desktop}) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${theme.spacing.lg};
  }
`;
