'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { RealtimeContext } from '@/lib/realtime/RealtimeProvider';
import type { Rgb } from '@/lib/realtime/glowColor';

import { putLight, type LightPutBody } from './putLight';
import { releaseLightPin } from './releaseLightPin';
import type { LightLive } from './useLightLive';

const THROTTLE_MS = 150;
const ECHO_GRACE_MS = 400;
const MAX_BRIGHTNESS = 255;
const MIN_BRIGHTNESS = 1;

interface Options {
  light: string;
  room: string | null;
  live: LightLive;
  applyLocal: (patch: Partial<LightLive>) => void;
  onError: (message: string) => void;
}

export interface LightControl {
  view: LightLive;
  isReleasing: boolean;
  setOn: (next: boolean) => void;
  changeBrightness: (fraction: number, isFinal: boolean) => void;
  cancelBrightness: (originalFraction: number) => void;
  changeColor: (rgb: Rgb, isFinal: boolean) => void;
  release: () => void;
}

function toBrightness(fraction: number): number {
  return Math.min(MAX_BRIGHTNESS, Math.max(MIN_BRIGHTNESS, Math.round(fraction * MAX_BRIGHTNESS)));
}

function buildBody(state: LightLive): LightPutBody {
  if (!state.on) return { on: false };
  const body: LightPutBody = { on: true };
  if (state.rgb) body.rgb_color = [Math.round(state.rgb[0]), Math.round(state.rgb[1]), Math.round(state.rgb[2])];
  if (state.brightness !== null) body.brightness = state.brightness;
  return body;
}

export function useLightControl({ light, room, live, applyLocal, onError }: Options): LightControl {
  const { setLightPin } = useContext(RealtimeContext);
  const [draft, setDraft] = useState<LightLive>(live);
  const [isDirty, setIsDirty] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const view = isDirty ? draft : live;
  const viewRef = useRef(view);
  const dirtyRef = useRef(false);
  const latest = useRef<LightLive>(live);
  const seq = useRef(0);
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const graceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSentInGesture = useRef(false);
  const callbacks = useRef({ applyLocal, onError });

  useEffect(() => {
    viewRef.current = view;
    callbacks.current = { applyLocal, onError };
  });

  useEffect(() => {
    return () => {
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
      if (graceTimer.current) clearTimeout(graceTimer.current);
    };
  }, []);

  const markDirty = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
    setIsDirty(dirty);
  }, []);

  const send = useCallback(async () => {
    const mine = ++seq.current;
    hasSentInGesture.current = true;
    const sent = latest.current;
    const [pin, err] = await putLight(light, buildBody(sent));
    if (mine !== seq.current) return;
    if (err) {
      callbacks.current.onError(err.message);
      markDirty(false);
      return;
    }
    callbacks.current.applyLocal({
      on: pin.on,
      rgb: pin.rgb_color ?? sent.rgb,
      brightness: pin.brightness ?? sent.brightness,
    });
    setLightPin(room, light, pin);
    if (graceTimer.current) clearTimeout(graceTimer.current);
    graceTimer.current = setTimeout(() => markDirty(false), ECHO_GRACE_MS);
  }, [light, room, setLightPin, markDirty]);

  const update = useCallback(
    (patch: Partial<LightLive>, isFinal: boolean) => {
      const base = dirtyRef.current ? latest.current : viewRef.current;
      const next = { ...base, ...patch };
      latest.current = next;
      setDraft(next);
      markDirty(true);
      if (graceTimer.current) clearTimeout(graceTimer.current);

      if (isFinal) {
        if (throttleTimer.current) clearTimeout(throttleTimer.current);
        throttleTimer.current = null;
        void send();
        hasSentInGesture.current = false;
        return;
      }
      if (throttleTimer.current) return;
      throttleTimer.current = setTimeout(() => {
        throttleTimer.current = null;
        void send();
      }, THROTTLE_MS);
    },
    [send, markDirty],
  );

  const setOn = useCallback((next: boolean) => update({ on: next }, true), [update]);

  const changeBrightness = useCallback(
    (fraction: number, isFinal: boolean) => update({ on: true, brightness: toBrightness(fraction) }, isFinal),
    [update],
  );

  const changeColor = useCallback((rgb: Rgb, isFinal: boolean) => update({ on: true, rgb }, isFinal), [update]);

  const cancelBrightness = useCallback(
    (originalFraction: number) => {
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
      throttleTimer.current = null;
      latest.current = { ...latest.current, brightness: toBrightness(originalFraction) };
      setDraft(latest.current);
      const needsRestore = hasSentInGesture.current;
      hasSentInGesture.current = false;
      if (!needsRestore) {
        markDirty(false);
        return;
      }
      void send();
      hasSentInGesture.current = false;
    },
    [send, markDirty],
  );

  const release = useCallback(() => {
    async function run() {
      setIsReleasing(true);
      const [, err] = await releaseLightPin(light);
      setIsReleasing(false);
      if (err) {
        callbacks.current.onError(err.message);
        return;
      }
      markDirty(false);
      setLightPin(room, light, null);
    }
    void run();
  }, [light, room, setLightPin, markDirty]);

  return { view, isReleasing, setOn, changeBrightness, cancelBrightness, changeColor, release };
}
