import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

export const StripWrap = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  margin: -${theme.spacing.sm} -${theme.spacing.lg} 0;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.scrim};
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);

  @media (min-width: ${theme.breakpoint.tablet}) {
    top: calc(${theme.size.topBar} + env(safe-area-inset-top, 0px));
    margin: -${theme.spacing.sm} 0 0;
    padding: ${theme.spacing.sm} 0;
  }
`;

export const Strip = styled.div`
  height: 112px;
  border-radius: ${theme.radius.xl};
  overflow: hidden;
  border: 1px solid ${theme.colors.borderSubtle};
  box-shadow: ${theme.shadow.card};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const FieldHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const Count = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};
  font-variant-numeric: tabular-nums;
`;

export const NameInput = styled.input<{ $hasError: boolean }>`
  min-height: ${theme.size.touch};
  padding: 0 ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  border: 1px solid ${({ $hasError }) => ($hasError ? theme.colors.dangerBorder : theme.colors.borderSubtle)};
  background: ${theme.colors.surfaceRaised};
  color: ${theme.colors.text};
  font: inherit;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};

  &::placeholder {
    color: ${theme.colors.textFaint};
    font-weight: ${theme.fontWeight.regular};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const Warning = styled.p`
  margin: 0;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surfaceRaised};
  color: ${theme.colors.text};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSize.sm};
`;

export const Saved = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surfaceRaised};
`;

export const SavedTitle = styled.div`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};

  & > * {
    flex: 1 1 140px;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;
