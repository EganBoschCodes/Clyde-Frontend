import type { Pin } from '@/lib/clyde';

function isRgb(value: unknown): boolean {
  return Array.isArray(value) && value.length === 3 && value.every(c => typeof c === 'number');
}

export function isPin(value: unknown): value is Pin {
  if (typeof value !== 'object' || value === null) return false;
  if (!('on' in value) || typeof value.on !== 'boolean') return false;
  if (!('rgb_color' in value) || (value.rgb_color !== null && !isRgb(value.rgb_color))) return false;
  if (!('brightness' in value)) return false;
  return value.brightness === null || typeof value.brightness === 'number';
}
