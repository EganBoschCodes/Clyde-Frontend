import * as S from './styles';

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <S.Screen>
      <S.Main>{children}</S.Main>
    </S.Screen>
  );
}
