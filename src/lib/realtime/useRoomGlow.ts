'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import { fetchLightState } from '@/lib/lights/fetchLightState';

import { blendColors, type Rgb } from './glowColor';
import { RealtimeContext } from './RealtimeProvider';

const MIN_UPDATE_INTERVAL_MS = 250;
const WARM_WHITE: Rgb = [255, 236, 210];

export type { Rgb };

interface LightGlow {
  on: boolean;
  rgb: Rgb;
}

export function useRoomGlow(room: string, lights: readonly string[]): Rgb | null {
  const { subscribeLightOn, subscribeLightOff, subscribeRoomState, resyncCount } = useContext(RealtimeContext);
  const [rgb, setRgb] = useState<Rgb | null>(null);
  const lightMap = useRef<Map<string, LightGlow>>(new Map());
  const lightEventAt = useRef<Map<string, number>>(new Map());
  const lastPublishMs = useRef(0);
  const trailingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lightsKey = lights.join('|');

  useEffect(() => {
    function blended(): Rgb | null {
      const onColors = [...lightMap.current.values()].filter(l => l.on).map(l => l.rgb);
      return blendColors(onColors);
    }

    function flush() {
      if (trailingTimer.current) clearTimeout(trailingTimer.current);
      trailingTimer.current = null;
      lastPublishMs.current = performance.now();
      setRgb(blended());
    }

    function publish() {
      const elapsed = performance.now() - lastPublishMs.current;
      if (elapsed >= MIN_UPDATE_INTERVAL_MS) {
        flush();
        return;
      }
      if (trailingTimer.current) return;
      trailingTimer.current = setTimeout(flush, MIN_UPDATE_INTERVAL_MS - elapsed);
    }

    const unsubscribeLight = subscribeLightOn(evt => {
      if (evt.room !== room) return;
      const previous = lightMap.current.get(evt.light);
      lightEventAt.current.set(evt.light, performance.now());
      lightMap.current.set(evt.light, { on: true, rgb: evt.rgb_color ?? previous?.rgb ?? WARM_WHITE });
      publish();
    });

    const unsubscribeOff = subscribeLightOff(evt => {
      if (evt.room !== room) return;
      const previous = lightMap.current.get(evt.light);
      lightEventAt.current.set(evt.light, performance.now());
      lightMap.current.set(evt.light, { on: false, rgb: previous?.rgb ?? WARM_WHITE });
      publish();
    });

    const unsubscribeState = subscribeRoomState(evt => {
      if (evt.room !== room || evt.active_routine !== null) return;
      const now = performance.now();
      for (const [name, glow] of lightMap.current) {
        lightEventAt.current.set(name, now);
        lightMap.current.set(name, { ...glow, on: false });
      }
      flush();
    });

    // Seed from the lights' current state
    const controller = new AbortController();
    const names = lightsKey ? lightsKey.split('|') : [];
    const startedAt = performance.now();
    async function seed() {
      const results = await Promise.all(names.map(n => fetchLightState(n, controller.signal)));
      if (controller.signal.aborted) return;
      for (const r of results) {
        if (!r) continue;
        if ((lightEventAt.current.get(r.light) ?? 0) > startedAt) continue;
        lightMap.current.set(r.light, { on: r.state.on, rgb: r.state.rgb_color ?? WARM_WHITE });
      }
      publish();
    }
    void seed();

    return () => {
      controller.abort();
      unsubscribeLight();
      unsubscribeOff();
      unsubscribeState();
      if (trailingTimer.current) clearTimeout(trailingTimer.current);
      trailingTimer.current = null;
    };
  }, [room, lightsKey, resyncCount, subscribeLightOn, subscribeLightOff, subscribeRoomState]);

  return rgb;
}
