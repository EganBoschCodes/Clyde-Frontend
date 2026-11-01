import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Grid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${theme.spacing.sm};

  @media (min-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${theme.spacing.md};
  }
`;
