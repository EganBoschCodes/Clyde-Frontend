import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Scroller = styled.div`
  margin: 0 calc(${theme.spacing.lg} * -1);
  padding: 0 ${theme.spacing.lg};
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(2, ${theme.size.touchSm});
  grid-auto-columns: max-content;
  gap: ${theme.spacing.sm};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  scroll-padding: 0 ${theme.spacing.lg};
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${theme.breakpoint.tablet}) {
    display: flex;
    flex-wrap: wrap;
    overflow: visible;
  }
`;

export const Chip = styled.button<{ $isSelected: boolean; $isOn: boolean }>`
  scroll-snap-align: start;
  min-height: ${theme.size.touchSm};
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.radius.full};
  border: 1px solid
    ${({ $isSelected, $isOn }) =>
      $isSelected ? ($isOn ? 'var(--room-glow, ' + theme.colors.accent + ')' : theme.colors.textFaint) : theme.colors.borderSubtle};
  background: ${({ $isSelected, $isOn }) =>
    $isSelected && $isOn ? 'var(--room-glow-soft, ' + theme.colors.accentSoft + ')' : theme.colors.surfaceRaised};
  color: ${({ $isSelected }) => ($isSelected ? theme.colors.text : theme.colors.textMuted)};
  font: inherit;
  font-size: ${theme.fontSize.sm};
  font-weight: ${({ $isSelected }) => ($isSelected ? theme.fontWeight.semibold : theme.fontWeight.medium)};
  white-space: nowrap;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 150ms ease, border-color 150ms ease, transform 120ms ease;

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
