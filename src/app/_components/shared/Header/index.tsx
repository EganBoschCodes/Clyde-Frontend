import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: ${theme.fontSize.hero};
  font-weight: ${theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  color: ${theme.colors.text};
`;

export const PageLede = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
`;

export const Nav = styled.nav`
  display: flex;
  gap: ${theme.spacing.sm};
`;
