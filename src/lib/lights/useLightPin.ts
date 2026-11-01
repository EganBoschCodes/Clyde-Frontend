'use client';

import { useContext } from 'react';

import type { Pin } from '@/lib/clyde';
import { RealtimeContext } from '@/lib/realtime/RealtimeProvider';

export function useLightPin(light: string, initial: Pin | null): Pin | null {
  const { lightPin } = useContext(RealtimeContext);
  if (!lightPin.has(light)) return initial;
  return lightPin.get(light) ?? null;
}
