import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Card = styled.article<{ $isOn: boolean }>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
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
    padding: ${theme.spacing.xl};
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
  gap: 2px;
`;

export const Name = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  line-height: 1.2;
  overflow-wrap: anywhere;
`;

export const Meta = styled.p`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  column-gap: ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

export const Status = styled.span<{ $isOn: boolean }>`
  color: ${({ $isOn }) => ($isOn ? theme.colors.text : theme.colors.textFaint)};
  font-weight: ${theme.fontWeight.medium};
`;

export const Error = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.dangerText};
`;
