import type { Rgb } from '@/lib/realtime/glowColor';

const HEX_PATTERN = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

export function rgbToHex(rgb: Rgb): string {
  const part = (c: number) => Math.min(255, Math.max(0, Math.round(c))).toString(16).padStart(2, '0');
  return `#${part(rgb[0])}${part(rgb[1])}${part(rgb[2])}`;
}

export function hexToRgb(hex: string): Rgb | null {
  const match = HEX_PATTERN.exec(hex);
  if (!match) return null;
  return [parseInt(match[1] ?? '', 16), parseInt(match[2] ?? '', 16), parseInt(match[3] ?? '', 16)];
}
