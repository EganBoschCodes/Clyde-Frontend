import Link from 'next/link';
import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadow.card};
`;

export const Preview = styled.div`
  height: 72px;
  border-radius: ${theme.radius.md};
  overflow: hidden;
`;

export const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: 0 ${theme.spacing.xs};
`;

export const Name = styled.h2`
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
`;

export const Meta = styled.span`
  flex: none;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.spacing.sm};
`;

export const Rooms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};

  & > button {
    flex: 1 1 100px;
  }
`;

export const Prompt = styled.p`
  margin: 0;
  padding: 0 ${theme.spacing.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

export const LinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${theme.size.touch};
  padding: 0 ${theme.spacing.md};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surfaceRaised};
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  text-decoration: none;
  touch-action: manipulation;

  &:focus-visible {
    outline: 2px solid ${theme.colors.accentText};
    outline-offset: 2px;
  }
`;

export const Full = styled.div`
  display: grid;
`;
