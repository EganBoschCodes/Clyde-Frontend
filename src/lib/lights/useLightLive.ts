'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { RealtimeContext } from '@/lib/realtime/RealtimeProvider';
import type { Rgb } from '@/lib/realtime/glowColor';

import { fetchLightState } from './fetchLightState';

const MIN_UPDATE_INTERVAL_MS = 250;

export interface LightLive {
  on: boolean | null;
  rgb: Rgb | null;
  brightness: number | null;
}

interface LightLiveResult {
  live: LightLive;
  applyLocal: (patch: Partial<LightLive>) => void;
}

const UNKNOWN: LightLive = { on: null, rgb: null, brightness: null };

export function useLightLive(light: string, seed: LightLive | null): LightLiveResult {
  const { subscribeLightOn, subscribeLightOff, resyncCount } = useContext(RealtimeContext);
  const [live, setLive] = useState<LightLive>(seed ?? UNKNOWN);
  const current = useRef<LightLive>(seed ?? UNKNOWN);
  const eventAt = useRef(0);
  const lastPublishMs = useRef(0);
  const trailingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (trailingTimer.current) clearTimeout(trailingTimer.current);
    trailingTimer.current = null;
    lastPublishMs.current = performance.now();
    setLive(current.current);
  }, []);

  const publish = useCallback(() => {
    const elapsed = performance.now() - lastPublishMs.current;
    if (elapsed >= MIN_UPDATE_INTERVAL_MS) {
      flush();
      return;
    }
    if (trailingTimer.current) return;
    trailingTimer.current = setTimeout(flush, MIN_UPDATE_INTERVAL_MS - elapsed);
  }, [flush]);

  const applyLocal = useCallback(
    (patch: Partial<LightLive>) => {
      eventAt.current = performance.now();
      current.current = { ...current.current, ...patch };
      flush();
    },
    [flush],
  );

  useEffect(() => {
    const unsubscribeOn = subscribeLightOn(evt => {
      if (evt.light !== light) return;
      const previous = current.current;
      eventAt.current = performance.now();
      current.current = {
        on: true,
        rgb: evt.rgb_color ?? previous.rgb,
        brightness: evt.brightness ?? previous.brightness,
      };
      publish();
    });

    const unsubscribeOff = subscribeLightOff(evt => {
      if (evt.light !== light) return;
      eventAt.current = performance.now();
      current.current = { ...current.current, on: false };
      publish();
    });

    // Seed from the light's current output unless a live event already arrived
    const controller = new AbortController();
    const startedAt = performance.now();
    async function seedFromState() {
      const result = await fetchLightState(light, controller.signal);
      if (controller.signal.aborted || !result) return;
      if (eventAt.current > startedAt) return;
      current.current = {
        on: result.state.on,
        rgb: result.state.rgb_color ?? current.current.rgb,
        brightness: result.state.brightness ?? current.current.brightness,
      };
      flush();
    }
    void seedFromState();

    return () => {
      controller.abort();
      unsubscribeOn();
      unsubscribeOff();
      if (trailingTimer.current) clearTimeout(trailingTimer.current);
      trailingTimer.current = null;
    };
  }, [light, resyncCount, subscribeLightOn, subscribeLightOff, publish, flush]);

  return { live, applyLocal };
}
