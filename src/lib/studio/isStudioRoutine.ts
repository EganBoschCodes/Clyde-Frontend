import { isStudioStyle, type StudioRoutine } from './types';

export function isStudioRoutine(value: unknown): value is StudioRoutine {
  if (typeof value !== 'object' || value === null) return false;
  if (!('key' in value) || typeof value.key !== 'string') return false;
  if (!('name' in value) || typeof value.name !== 'string') return false;
  if (!('colors' in value) || !Array.isArray(value.colors)) return false;
  if (!value.colors.every(color => typeof color === 'string')) return false;
  if (!('style' in value) || !isStudioStyle(value.style)) return false;
  if (!('speed' in value) || typeof value.speed !== 'number') return false;
  if (!('brightness' in value) || typeof value.brightness !== 'number') return false;
  return true;
}
