'use client';

import { useContext } from 'react';

import type { Pin } from '@/lib/clyde';
import { RealtimeContext } from '@/lib/realtime/RealtimeProvider';

export function useRoomPins(lights: readonly string[], initial: Readonly<Record<string, Pin>>): Record<string, Pin> {
  const { lightPin } = useContext(RealtimeContext);
  const pins: Record<string, Pin> = {};
  for (const light of lights) {
    const pin = lightPin.has(light) ? lightPin.get(light) : initial[light];
    if (pin) pins[light] = pin;
  }
  return pins;
}
