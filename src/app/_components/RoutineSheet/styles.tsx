import styled, { keyframes } from 'styled-components';

import { theme } from '@/styles/theme';

const slideUp = keyframes`
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${theme.zIndex.sheet};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: ${theme.colors.sheetScrim};

  @media (min-width: ${theme.breakpoint.tablet}) {
    align-items: center;
  }
`;

export const Sheet = styled.div`
  width: 100%;
  max-width: 520px;
  max-height: 85dvh;
  display: flex;
  flex-direction: column;
  border-radius: ${theme.radius.xl} ${theme.radius.xl} 0 0;
  border: 1px solid ${theme.colors.border};
  border-bottom: none;
  background: ${theme.colors.surface};
  padding-bottom: env(safe-area-inset-bottom, 0px);
  animation: ${slideUp} 180ms ease-out;

  @media (min-width: ${theme.breakpoint.tablet}) {
    border-radius: ${theme.radius.xl};
    border-bottom: 1px solid ${theme.colors.border};
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Handle = styled.div`
  align-self: center;
  width: 40px;
  height: 4px;
  margin-top: ${theme.spacing.sm};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.borderStrong};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
`;

export const CloseButton = styled.button`
  min-height: ${theme.size.touchSm};
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.radius.full};
  border: 1px solid ${theme.colors.borderStrong};
  background: transparent;
  color: ${theme.colors.text};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const Body = styled.div`
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  padding: 0 ${theme.spacing.lg} ${theme.spacing.lg};
`;

export const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const GroupTitle = styled.h3`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.textMuted};
`;

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Option = styled.button<{ $isCurrent: boolean }>`
  min-height: ${theme.size.touch};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  border: 1px solid ${({ $isCurrent }) => ($isCurrent ? theme.colors.text : theme.colors.borderSubtle)};
  background: ${({ $isCurrent }) => ($isCurrent ? theme.colors.accentSoft : theme.colors.surfaceRaised)};
  color: ${theme.colors.text};
  font: inherit;
  font-size: ${theme.fontSize.base};
  font-weight: ${({ $isCurrent }) => ($isCurrent ? theme.fontWeight.semibold : theme.fontWeight.medium)};
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: ${theme.colors.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const Check = styled.span`
  font-weight: ${theme.fontWeight.bold};
`;
