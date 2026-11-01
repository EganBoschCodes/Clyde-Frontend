import type { Result } from '@/lib/clyde';

async function parseErrorBody(res: Response): Promise<string> {
  const body: unknown = await res.json().catch(() => null);
  if (typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string') return body.error;
  return `HTTP ${res.status}`;
}

export async function sendLightRequest(url: string, init: RequestInit): Promise<Result<unknown>> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }
  if (!res.ok) return [null, new Error(await parseErrorBody(res))];
  const body: unknown = await res.json().catch(() => null);
  return [body, null];
}
