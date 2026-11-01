import Link from 'next/link';
import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Card = styled.article<{ $isOn: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg};
  border-radius: ${theme.radius.xl};
  border: 1px solid ${({ $isOn }) => ($isOn ? 'var(--room-glow-border, ' + theme.colors.borderSubtle + ')' : theme.colors.borderSubtle)};
  background:
    ${({ $isOn }) =>
      $isOn
        ? 'radial-gradient(120% 90% at 100% 0%, var(--room-glow-wash, ' + theme.colors.accentSoft + '), transparent 65%),'
        : ''}
    ${theme.colors.surface};
  box-shadow: ${theme.shadow.card};
  transition: border-color 400ms ease, background 400ms ease;

  @media (min-width: ${theme.breakpoint.tablet}) {
    padding: ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.xl};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

export const Titles = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.xs};
`;

export const Name = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  line-height: 1.2;
  overflow-wrap: anywhere;
`;

export const PillRow = styled.div`
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: ${theme.spacing.xs};
`;

export const PinLink = styled(Link)`
  min-height: ${theme.size.touchSm};
  display: inline-flex;
  align-items: center;
  padding: 0 ${theme.spacing.sm};
  border-radius: ${theme.radius.full};
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSize.sm};
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: ${theme.colors.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const RoutinePill = styled.button`
  max-width: 100%;
  min-height: ${theme.size.touchSm};
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: 0 ${theme.spacing.md};
  border-radius: ${theme.radius.full};
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.surfaceRaised};
  color: ${theme.colors.text};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const PillText = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Chevron = styled.span`
  color: ${theme.colors.textMuted};
`;

export const Error = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.dangerText};
`;
