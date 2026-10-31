'use client';

import { useConnectionStatus } from '@/lib/realtime/useConnectionStatus';

import * as S from './styles';

export default function ConnectionPill() {
  const isConnected = useConnectionStatus();
  if (isConnected) return null;
  return <S.Pill role="status">Reconnecting…</S.Pill>;
}
