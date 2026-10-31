import Link from 'next/link';
import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Bar = styled.nav`
  position: fixed;
  inset: auto 0 0 0;
  z-index: 10;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  background: ${theme.colors.scrim};
  border-top: 1px solid ${theme.colors.borderSubtle};
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  backdrop-filter: blur(18px) saturate(1.4);

  @media (min-width: ${theme.breakpoint.tablet}) {
    position: sticky;
    inset: 0 0 auto 0;
    padding-bottom: 0;
    padding-top: env(safe-area-inset-top, 0px);
    border-top: none;
    border-bottom: 1px solid ${theme.colors.borderSubtle};
  }
`;

export const Inner = styled.div`
  margin: 0 auto;
  max-width: ${theme.maxWidth.wide};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${theme.breakpoint.tablet}) {
    height: ${theme.size.topBar};
    padding: 0 ${theme.spacing.xl};
  }
`;

export const Brand = styled.span`
  display: none;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
  letter-spacing: -0.01em;

  @media (min-width: ${theme.breakpoint.tablet}) {
    display: block;
  }
`;

export const Tabs = styled.div`
  display: flex;
  flex: 1;

  @media (min-width: ${theme.breakpoint.tablet}) {
    flex: none;
    gap: ${theme.spacing.xs};
  }
`;

export const TabLink = styled(Link)<{ $isActive: boolean }>`
  flex: 1;
  min-height: ${theme.size.tabBar};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: ${({ $isActive }) => ($isActive ? theme.colors.accentText : theme.colors.textFaint)};
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 120ms ease, background-color 120ms ease;

  &:active {
    background: ${theme.colors.surfaceHover};
  }

  @media (min-width: ${theme.breakpoint.tablet}) {
    flex: none;
    flex-direction: row;
    min-height: ${theme.size.touchSm};
    padding: 0 ${theme.spacing.lg};
    gap: ${theme.spacing.sm};
    border-radius: ${theme.radius.full};
    background: ${({ $isActive }) => ($isActive ? theme.colors.accentSoft : 'transparent')};

    &:hover {
      color: ${theme.colors.text};
      background: ${({ $isActive }) => ($isActive ? theme.colors.accentSoft : theme.colors.surfaceHover)};
    }
  }
`;

export const TabLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};

  @media (min-width: ${theme.breakpoint.tablet}) {
    font-size: ${theme.fontSize.sm};
  }
`;
