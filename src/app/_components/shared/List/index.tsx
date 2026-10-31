import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const ListRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.borderSubtle};
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadow.card};
`;

export const RowBody = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const RowTitle = styled.div`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  text-transform: capitalize;
`;

export const RowMeta = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};

  & > span.sep {
    margin: 0 ${theme.spacing.xs};
    color: ${theme.colors.textFaint};
  }
`;
