import type { CSSProperties } from 'react';

import type { Rgb } from '@/lib/realtime/useRoomGlow';

const DEFAULT_GLOW: Rgb = [192, 38, 211];
const WASH_ALPHA = 0.22;
const BORDER_ALPHA = 0.4;

function rgba(rgb: Rgb, alpha: number): string {
  return `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${alpha})`;
}

export function glowStyle(rgb: Rgb | null): CSSProperties {
  const color = rgb ?? DEFAULT_GLOW;
  return {
    '--room-glow': rgba(color, 1),
    '--room-glow-wash': rgba(color, WASH_ALPHA),
    '--room-glow-soft': rgba(color, WASH_ALPHA),
    '--room-glow-border': rgba(color, BORDER_ALPHA),
  } as CSSProperties;
}
