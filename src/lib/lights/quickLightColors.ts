import { QUICK_COLORS } from '@/lib/studio/quickColors';
import type { Rgb } from '@/lib/realtime/glowColor';

import { hexToRgb } from './colorHex';

export interface LightColor {
  name: string;
  rgb: Rgb;
}

// Blackbody approximations from warm candle-like to cool daylight
export const WHITES: readonly LightColor[] = [
  { name: 'Candle 2200K', rgb: [255, 147, 44] },
  { name: 'Warm white 2700K', rgb: [255, 169, 87] },
  { name: 'Soft white 3000K', rgb: [255, 180, 107] },
  { name: 'Neutral 4000K', rgb: [255, 209, 163] },
  { name: 'Bright 5000K', rgb: [255, 228, 206] },
  { name: 'Daylight 6500K', rgb: [255, 249, 253] },
];

const WHITISH_NAMES = new Set(['Candle white', 'Warm white', 'Soft gold']);
const FALLBACK_RGB: Rgb = [255, 255, 255];

export const COLORS: readonly LightColor[] = QUICK_COLORS.filter(quick => !WHITISH_NAMES.has(quick.name)).map(quick => ({
  name: quick.name,
  rgb: hexToRgb(quick.hex) ?? FALLBACK_RGB,
}));
