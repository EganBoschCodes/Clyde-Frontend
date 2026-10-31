import type { CSSProperties } from 'react';

import { isLightColor, type Rgb } from '@/lib/realtime/glowColor';
import { theme } from '@/styles/theme';

const WASH_ALPHA = 0.22;
const BORDER_ALPHA = 0.4;
const NEUTRAL_RGB: Rgb = [212, 212, 216];

function rgba(rgb: Rgb, alpha: number): string {
  return `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${alpha})`;
}

export function glowStyle(rgb: Rgb | null): CSSProperties {
  const color = rgb ?? NEUTRAL_RGB;
  const wash = rgb ? WASH_ALPHA : 0.08;
  return {
    '--room-glow': rgba(color, 1),
    '--room-glow-ink': isLightColor(color) ? theme.colors.lightInkDark : theme.colors.lightInkLight,
    '--room-glow-wash': rgba(color, wash),
    '--room-glow-border': rgba(color, BORDER_ALPHA),
  } as CSSProperties;
}
