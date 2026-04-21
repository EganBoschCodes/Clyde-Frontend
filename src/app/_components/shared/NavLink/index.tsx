import Link from 'next/link';
import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const NavLink = styled(Link)`
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  font-size: ${theme.fontSize.sm};
  color: inherit;
  text-decoration: none;
  transition: background-color 120ms ease;

  &:hover {
    background: ${theme.colors.surfaceHover};
  }
`;

export const BackLink = styled(Link)`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
  text-decoration: none;
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.textMuted};
  }
`;
