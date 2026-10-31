import type { Result, RoomStatus, RoomsResponse } from '@/lib/clyde';

export async function fetchRoomsSnapshot(): Promise<Result<RoomStatus[]>> {
  let res: Response;
  try {
    res = await fetch('/api/clyde/rooms', { cache: 'no-store' });
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }
  if (!res.ok) return [null, new Error(`HTTP ${res.status}`)];
  const body = (await res.json().catch(() => null)) as RoomsResponse | null;
  if (!body || !Array.isArray(body.rooms)) return [null, new Error('Malformed rooms response')];
  return [body.rooms, null];
}
