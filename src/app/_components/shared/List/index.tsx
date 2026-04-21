import styled from 'styled-components';

import { theme } from '@/styles/theme';

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.radius.sm};

  & > li + li {
    border-top: 1px solid ${theme.colors.divider};
  }
`;

export const ListRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
`;

export const RowBody = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const RowTitle = styled.div`
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text};
`;

export const RowMeta = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textFaint};

  & > span.sep {
    margin: 0 ${theme.spacing.xs};
  }
`;
