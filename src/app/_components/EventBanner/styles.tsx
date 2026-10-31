import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Banner = styled.div`
  position: fixed;
  z-index: ${theme.zIndex.banner};
  left: max(${theme.spacing.md}, env(safe-area-inset-left, 0px));
  right: max(${theme.spacing.md}, env(safe-area-inset-right, 0px));
  bottom: calc(${theme.size.tabBar} + env(safe-area-inset-bottom, 0px) + ${theme.spacing.sm});
  max-height: 40dvh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.xs} ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.surfaceRaised};
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.8);

  @media (min-width: ${theme.breakpoint.tablet}) {
    left: 50%;
    right: auto;
    bottom: auto;
    width: min(440px, calc(100vw - 32px));
    transform: translateX(-50%);
    top: calc(${theme.size.topBar} + env(safe-area-inset-top, 0px) + ${theme.spacing.md});
  }
`;

export const Items = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

export const ItemText = styled.p`
  margin: 0;
  min-width: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

export const Strong = styled.span`
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeight.semibold};
`;

export const CancelButton = styled.button`
  flex-shrink: 0;
  min-height: ${theme.size.touchSm};
  min-width: ${theme.size.touchSm};
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.dangerBorder};
  background: transparent;
  color: ${theme.colors.dangerText};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
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

export const CancelAll = styled(CancelButton)`
  align-self: stretch;
  margin-right: ${theme.spacing.xs};
`;

export const Error = styled.p`
  margin: 0;
  padding-right: ${theme.spacing.md};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.dangerText};
`;
