import Link from 'next/link';
import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const Hero = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border-radius: ${theme.radius.xl};
  border: 1px dashed ${theme.colors.border};
`;

export const HeroTitle = styled.div`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  letter-spacing: -0.02em;
`;

export const Grid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.sm};

  @media (min-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const TemplateLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  text-decoration: none;
  touch-action: manipulation;

  &:active {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const Swatch = styled.span`
  display: block;
  height: 56px;
  border-radius: ${theme.radius.md};
  overflow: hidden;
`;

export const TemplateText = styled.span`
  display: flex;
  flex-direction: column;
  padding: 0 ${theme.spacing.xs} ${theme.spacing.xs};
`;

export const TemplateName = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
`;

export const TemplateTagline = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;
