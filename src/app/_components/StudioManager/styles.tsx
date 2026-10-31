import Link from 'next/link';
import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const Grid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};

  @media (min-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
`;

export const NewLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${theme.size.touch};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.accent};
  color: ${theme.colors.onAccent};
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
  text-decoration: none;
  touch-action: manipulation;

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;
