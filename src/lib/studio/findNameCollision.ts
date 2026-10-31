import { slugify } from './slugify';
import type { StudioRoutine } from './types';

export function findNameCollision(name: string, editingKey: string | null, existing: readonly StudioRoutine[]): StudioRoutine | null {
  const slug = slugify(name);
  if (!slug) return null;

  for (const routine of existing) {
    if (routine.key === editingKey) continue;
    if (routine.key === `studio_${slug}` || slugify(routine.name) === slug) return routine;
  }
  return null;
}
