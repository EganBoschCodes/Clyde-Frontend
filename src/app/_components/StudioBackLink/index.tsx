import Link from 'next/link';
import styled from 'styled-components';

import { theme } from '@/styles/theme';

const BackLink = styled(Link)`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  min-height: ${theme.size.touchSm};
  margin-left: -${theme.spacing.xs};
  padding: 0 ${theme.spacing.sm};
  border-radius: ${theme.radius.md};
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSize.base};
  text-decoration: none;

  &:hover {
    color: ${theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
  }
`;

export default function StudioBackLink() {
  return <BackLink href="/studio">&larr; Studio</BackLink>;
}
