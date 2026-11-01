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
  position: relative;
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
  width: 40px;
  height: 4px;
  margin: 0 auto;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.borderStrong};
`;

export const DragZone = styled.div`
  padding-top: ${theme.spacing.sm};
  flex-shrink: 0;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

export const Header = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
`;

// Closing is by dragging down, Escape, or tapping the backdrop; this stays for assistive tech and keyboards
export const HiddenClose = styled.button`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  border: none;
  white-space: nowrap;

  &:focus-visible {
    width: auto;
    height: ${theme.size.touchSm};
    padding: 0 ${theme.spacing.lg};
    clip-path: none;
    border: 1px solid ${theme.colors.borderStrong};
    border-radius: ${theme.radius.full};
    background: ${theme.colors.surfaceRaised};
    color: ${theme.colors.text};
    font: inherit;
    font-size: ${theme.fontSize.sm};
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
