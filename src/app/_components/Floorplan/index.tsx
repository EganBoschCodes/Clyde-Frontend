'use client';

import { useEffect, useState } from 'react';

import type { LightState, LightStateResponse } from '@/lib/clyde';

import * as S from './styles';

// TODO: replace polling with `light_state` realtime events once the backend emits them.
const POLL_INTERVAL_MS = 3000;
const MIN_GLOW_OPACITY = 0.15;
const MAX_BRIGHTNESS = 255;
const LAMP_RADIUS = 28;
const LAMP_GLOW_RADIUS = 80;

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
};

interface FloorplanProps {
  lights: string[];
}

type LightStateMap = Record<string, LightState>;

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
  const body = (await res.json().catch(() => null)) as LightStateResponse | null;
  return body;
}

async function fetchAllStates(
  lights: string[],
  signal: AbortSignal,
): Promise<LightStateMap> {
  const results = await Promise.all(lights.map(l => fetchLightState(l, signal)));
  const map: LightStateMap = {};
  for (const r of results) {
    if (!r) continue;
    map[r.light] = r.state;
  }
  return map;
}

function rgbString(rgb: [number, number, number]): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function lampOpacity(brightness: number | null): number {
  if (brightness === null) return 1;
  const ratio = brightness / MAX_BRIGHTNESS;
  return MIN_GLOW_OPACITY + ratio * (1 - MIN_GLOW_OPACITY);
}

function renderLamp(name: string, pos: LampPosition, state: LightState | undefined) {
  if (!state || !state.on || !state.rgb_color) return null;
  const color = rgbString(state.rgb_color);
  const opacity = lampOpacity(state.brightness);
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

export default function Floorplan({ lights }: FloorplanProps) {
  const [states, setStates] = useState<LightStateMap>({});

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function tick() {
      const map = await fetchAllStates(lights, controller.signal);
      if (cancelled) return;
      setStates(map);
    }

    void tick();
    const interval = setInterval(() => void tick(), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(interval);
    };
  }, [lights]);

  const mapped = lights.filter(l => l in LAMP_POSITIONS);

  return (
    <S.Container>
      <S.Svg
        viewBox="0 0 1900 1100"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        {mapped.map(name => renderLamp(name, LAMP_POSITIONS[name]!, states[name]))}
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
