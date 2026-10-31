import styled from 'styled-components';

import { theme } from '@/styles/theme';

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding-top: ${theme.spacing.sm};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${theme.fontSize.hero};
  font-weight: ${theme.fontWeight.bold};
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: ${theme.colors.text};
`;

const Lede = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.base};
  line-height: 1.4;
  color: ${theme.colors.textMuted};
`;

interface PageHeaderProps {
  title: string;
  lede?: string;
}

export default function PageHeader({ title, lede }: PageHeaderProps) {
  return (
    <Header>
      <Title>{title}</Title>
      {lede ? <Lede>{lede}</Lede> : null}
    </Header>
  );
}
