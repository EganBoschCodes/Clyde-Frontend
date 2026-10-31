import * as S from './styles';

interface LoadingShellProps {
  children: React.ReactNode;
  isWide?: boolean;
}

// Separate styled components from PageShell so streamed content keeps its own styles
export default function LoadingShell({ children, isWide = false }: LoadingShellProps) {
  return (
    <S.Screen aria-busy="true">
      <S.Main $isWide={isWide}>{children}</S.Main>
    </S.Screen>
  );
}
