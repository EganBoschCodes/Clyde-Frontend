'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import { RealtimeContext } from './RealtimeProvider';

const MIN_UPDATE_INTERVAL_MS = 250;

export type Rgb = [number, number, number];

export function useRoomGlow(room: string): Rgb | null {
  const { subscribeLightOn } = useContext(RealtimeContext);
  const [rgb, setRgb] = useState<Rgb | null>(null);
  const lastUpdateMs = useRef(0);

  useEffect(() => {
    return subscribeLightOn(evt => {
      if (evt.room !== room || !evt.rgb_color) return;
      const now = performance.now();
      if (now - lastUpdateMs.current < MIN_UPDATE_INTERVAL_MS) return;
      lastUpdateMs.current = now;
      setRgb(evt.rgb_color);
    });
  }, [room, subscribeLightOn]);

  return rgb;
}
