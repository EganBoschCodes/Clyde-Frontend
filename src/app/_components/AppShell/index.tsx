import type { ReactNode } from 'react';

import AppNav from '../AppNav';
import ConnectionPill from '../ConnectionPill';
import EventBanner from '../EventBanner';
import * as S from './styles';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <S.StatusBarBackdrop aria-hidden="true" />
      <AppNav />
      {children}
      <EventBanner />
      <ConnectionPill />
    </>
  );
}
