import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const HomeGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${theme.spacing.xl};
  align-items: start;

  @media (min-width: ${theme.breakpoint.desktop}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
`;

export const RoomStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const Aside = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (min-width: ${theme.breakpoint.desktop}) {
    position: sticky;
    top: calc(${theme.size.topBar} + ${theme.spacing.xl});
  }
`;
