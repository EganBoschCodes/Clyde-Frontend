import * as S from './styles';

interface PageShellProps {
  children: React.ReactNode;
  isWide?: boolean;
}

export default function PageShell({ children, isWide = false }: PageShellProps) {
  return (
    <S.Screen>
      <S.Main $isWide={isWide}>{children}</S.Main>
    </S.Screen>
  );
}
