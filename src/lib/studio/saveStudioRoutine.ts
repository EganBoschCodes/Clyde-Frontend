import type { Result } from '@/lib/clyde';

import { isStudioRoutine } from './isStudioRoutine';
import type { StudioRoutine, StudioSpec } from './types';

export async function saveStudioRoutine(spec: StudioSpec, key: string | null): Promise<Result<StudioRoutine>> {
  const payload = key ? { ...spec, key } : spec;

  let res: Response;
  try {
    res = await fetch('/api/clyde/studio/routines', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }

  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message = typeof body === 'object' && body !== null && 'error' in body ? String(body.error) : `HTTP ${res.status}`;
    return [null, new Error(message)];
  }
  if (!isStudioRoutine(body)) return [null, new Error('Unexpected response from server')];
  return [body, null];
}
