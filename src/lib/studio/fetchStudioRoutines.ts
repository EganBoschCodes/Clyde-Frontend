import type { Result } from '@/lib/clyde';

import { isStudioRoutine } from './isStudioRoutine';
import type { StudioRoutine } from './types';

const DEFAULT_CLYDE_URL = 'http://localhost:8765';

export async function fetchStudioRoutines(): Promise<Result<StudioRoutine[]>> {
  const url = `${process.env['CLYDE_BACKEND_URL'] ?? DEFAULT_CLYDE_URL}/api/studio/routines`;

  let res: Response;
  try {
    res = await fetch(url, { cache: 'no-store' });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return [null, new Error(`GET ${url}: ${err.message}`)];
  }
  if (!res.ok) return [null, new Error(`GET ${url}: HTTP ${res.status}`)];

  const body: unknown = await res.json().catch(() => null);
  if (typeof body !== 'object' || body === null) return [null, new Error('Unexpected response')];
  if (!('routines' in body) || !Array.isArray(body.routines)) return [null, new Error('Unexpected response')];

  return [body.routines.filter(isStudioRoutine), null];
}
