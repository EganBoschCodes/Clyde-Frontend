'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { LightState, LightStateResponse } from '@/lib/clyde';
import { RealtimeContext } from '@/lib/realtime/RealtimeProvider';

import * as S from './styles';

const POLL_INTERVAL_MS = 5000;
const MIN_GLOW_OPACITY = 0.15;
const MAX_BRIGHTNESS = 255;
const LAMP_RADIUS = 28;
const LAMP_GLOW_RADIUS = 80;
const DEFAULT_RGB: [number, number, number] = [255, 255, 255];

interface LampPosition {
  x: number;
  y: number;
}

const LAMP_POSITIONS: Record<string, LampPosition> = {
  egan_bedside_lamp: { x: 180, y: 450 },
  mackenzie_bedside_lamp: { x: 180, y: 190 },
  desk_lamp: { x: 960, y: 250 },
  living_room_lamp_1: { x: 1170, y: 190 },
  living_room_lamp_2: { x: 1210, y: 150 },
  kitchen_island_1: { x: 1250, y: 780 },
  kitchen_island_2: { x: 1500, y: 780 },
  dining_table_1: { x: 1720, y: 930 },
  dining_table_2: { x: 1720, y: 780 },
  dining_table_3: { x: 1720, y: 630 },
};

interface FloorplanRoom {
  name: string;
  lights: string[];
}

interface FloorplanProps {
  rooms: FloorplanRoom[];
}

interface RenderedLight {
  on: boolean;
  brightness: number;
  rgb: [number, number, number];
}

interface LightAnimation {
  from: RenderedLight;
  to: RenderedLight;
  startMs: number;
  durationMs: number;
}

const OFF_RENDERED: RenderedLight = {
  on: false,
  brightness: 0,
  rgb: DEFAULT_RGB,
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRendered(from: RenderedLight, to: RenderedLight, t: number): RenderedLight {
  return {
    on: t >= 1 ? to.on : from.on || to.on,
    brightness: lerp(from.brightness, to.brightness, t),
    rgb: [
      lerp(from.rgb[0], to.rgb[0], t),
      lerp(from.rgb[1], to.rgb[1], t),
      lerp(from.rgb[2], to.rgb[2], t),
    ],
  };
}

function fromLightState(state: LightState): RenderedLight {
  return {
    on: state.on,
    brightness: state.brightness ?? (state.on ? MAX_BRIGHTNESS : 0),
    rgb: state.rgb_color ?? DEFAULT_RGB,
  };
}

async function fetchLightState(
  light: string,
  signal: AbortSignal,
): Promise<LightStateResponse | null> {
  let res: Response;
  try {
    res = await fetch(`/api/clyde/lights/${encodeURIComponent(light)}/state`, {
      signal,
      cache: 'no-store',
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  return (await res.json().catch(() => null)) as LightStateResponse | null;
}

function rgbString(rgb: [number, number, number]): string {
  const r = Math.round(rgb[0]);
  const g = Math.round(rgb[1]);
  const b = Math.round(rgb[2]);
  return `rgb(${r}, ${g}, ${b})`;
}

function lampOpacity(brightness: number): number {
  const ratio = Math.max(0, Math.min(1, brightness / MAX_BRIGHTNESS));
  return MIN_GLOW_OPACITY + ratio * (1 - MIN_GLOW_OPACITY);
}

function renderLamp(name: string, pos: LampPosition, rendered: RenderedLight | undefined) {
  if (!rendered || !rendered.on) return null;
  const color = rgbString(rendered.rgb);
  const opacity = lampOpacity(rendered.brightness);
  return (
    <g key={name}>
      <circle
        cx={pos.x}
        cy={pos.y}
        r={LAMP_GLOW_RADIUS}
        fill={color}
        opacity={opacity * 0.35}
        stroke="none"
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={LAMP_RADIUS}
        fill={color}
        opacity={opacity}
        stroke="none"
      />
    </g>
  );
}

export default function Floorplan({ rooms }: FloorplanProps) {
  const { subscribeLightOn, subscribeRoomState } = useContext(RealtimeContext);
  const lights = useMemo(() => rooms.flatMap(r => r.lights), [rooms]);
  const roomLights = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const r of rooms) map[r.name] = r.lights;
    return map;
  }, [rooms]);
  const renderedRef = useRef<Record<string, RenderedLight>>({});
  const animationsRef = useRef<Record<string, LightAnimation>>({});
  const rafRef = useRef<number | null>(null);
  const [, setRenderTick] = useState(0);

  const forceRender = () => setRenderTick(t => t + 1);

  function snapshotCurrent(name: string): RenderedLight {
    const anim = animationsRef.current[name];
    if (anim) {
      const t = Math.min(1, (performance.now() - anim.startMs) / Math.max(1, anim.durationMs));
      return lerpRendered(anim.from, anim.to, t);
    }
    return renderedRef.current[name] ?? OFF_RENDERED;
  }

  function ensureRaf() {
    if (rafRef.current !== null) return;
    const step = () => {
      rafRef.current = null;
      const now = performance.now();
      const anims = animationsRef.current;
      let active = false;
      for (const name of Object.keys(anims)) {
        const anim = anims[name]!;
        const duration = Math.max(1, anim.durationMs);
        const t = Math.min(1, (now - anim.startMs) / duration);
        renderedRef.current[name] = lerpRendered(anim.from, anim.to, t);
        if (t >= 1) {
          delete anims[name];
          continue;
        }
        active = true;
      }
      forceRender();
      if (active) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function pollOnce() {
      const results = await Promise.all(lights.map(l => fetchLightState(l, controller.signal)));
      if (cancelled) return;
      let changed = false;
      for (const r of results) {
        if (!r) continue;
        if (animationsRef.current[r.light]) continue;
        renderedRef.current[r.light] = fromLightState(r.state);
        changed = true;
      }
      if (changed) forceRender();
    }

    void pollOnce();
    const interval = setInterval(() => void pollOnce(), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(interval);
    };
  }, [lights]);

  useEffect(() => {
    const unsubscribe = subscribeLightOn(evt => {
      if (!(evt.light in LAMP_POSITIONS)) return;
      const from = snapshotCurrent(evt.light);
      const to: RenderedLight = {
        on: true,
        rgb: evt.rgb_color ?? from.rgb,
        brightness: evt.brightness ?? (from.on ? from.brightness : MAX_BRIGHTNESS),
      };
      const durationMs = (evt.transition ?? 0) * 1000;
      if (durationMs <= 0) {
        delete animationsRef.current[evt.light];
        renderedRef.current[evt.light] = to;
        forceRender();
        return;
      }
      animationsRef.current[evt.light] = {
        from,
        to,
        startMs: performance.now(),
        durationMs,
      };
      ensureRaf();
    });
    return () => {
      unsubscribe();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [subscribeLightOn]);

  useEffect(() => {
    const unsubscribe = subscribeRoomState(evt => {
      if (evt.active_routine !== null) return;
      const roomLightNames = roomLights[evt.room];
      if (!roomLightNames) return;
      let changed = false;
      for (const light of roomLightNames) {
        if (!(light in LAMP_POSITIONS)) continue;
        delete animationsRef.current[light];
        renderedRef.current[light] = OFF_RENDERED;
        changed = true;
      }
      if (changed) forceRender();
    });
    return unsubscribe;
  }, [subscribeRoomState, roomLights]);

  const mapped = lights.filter(l => l in LAMP_POSITIONS);

  return (
    <S.Container>
      <S.Svg
        viewBox="0 0 1900 1100"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        {mapped.map(name => renderLamp(name, LAMP_POSITIONS[name]!, renderedRef.current[name]))}
        <path
          strokeWidth={12}
          d="M 60 70 H 1450 V 200 H 1700 V 560 H 1820 V 1015 H 1010 V 970 H 880 V 1015 H 60 Z"
        />
        <g strokeWidth={9}>
          <line x1={540} y1={70} x2={540} y2={600} />
          <line x1={1080} y1={70} x2={1080} y2={600} />
          <line x1={60} y1={600} x2={150} y2={600} />
          <line x1={460} y1={600} x2={540} y2={600} />
          <line x1={640} y1={600} x2={1080} y2={600} />
          <line x1={60} y1={800} x2={150} y2={800} />
          <line x1={300} y1={800} x2={800} y2={800} />
          <line x1={150} y1={600} x2={150} y2={800} />
          <line x1={300} y1={600} x2={300} y2={800} />
          <line x1={460} y1={710} x2={460} y2={800} />
          <line x1={420} y1={800} x2={420} y2={1015} />
          <line x1={800} y1={800} x2={800} y2={1015} />
        </g>
      </S.Svg>
    </S.Container>
  );
}
