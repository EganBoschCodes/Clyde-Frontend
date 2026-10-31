'use client';

import PageShell from '../PageShell';
import { ErrorBanner } from '../Section';
import * as S from './styles';

interface RouteErrorProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export default function RouteError({ title, message, onRetry }: RouteErrorProps) {
  return (
    <PageShell>
      <S.Title>{title}</S.Title>
      <ErrorBanner role="alert">{message}</ErrorBanner>
      <S.RetryButton type="button" onClick={onRetry}>
        Try again
      </S.RetryButton>
    </PageShell>
  );
}
