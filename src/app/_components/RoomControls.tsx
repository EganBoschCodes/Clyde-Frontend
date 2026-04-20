'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DAYLIGHT_ROUTINE = 'daylight';

type Action = 'on' | 'off';

interface RoomControlsProps {
  room: string;
}

async function parseErrorBody(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? `HTTP ${res.status}`;
}

async function setRoomRoutine(room: string, routine: string): Promise<Error | null> {
  const url = `/api/clyde/rooms/${encodeURIComponent(room)}/routine`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ routine }),
    });
  } catch (e) {
    return e instanceof Error ? e : new Error(String(e));
  }
  if (res.ok) return null;
  return new Error(await parseErrorBody(res));
}

async function turnRoomLightsOff(room: string): Promise<Error | null> {
  const url = `/api/clyde/rooms/${encodeURIComponent(room)}/lights`;
  let res: Response;
  try {
    res = await fetch(url, { method: 'DELETE' });
  } catch (e) {
    return e instanceof Error ? e : new Error(String(e));
  }
  if (res.ok) return null;
  return new Error(await parseErrorBody(res));
}

export default function RoomControls({ room }: RoomControlsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handle(action: Action) {
    setPending(action);
    setError(null);
    const err =
      action === 'on'
        ? await setRoomRoutine(room, DAYLIGHT_ROUTINE)
        : await turnRoomLightsOff(room);
    setPending(null);
    if (err) {
      setError(err.message);
      return;
    }
    router.refresh();
  }

  const btn =
    'rounded border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50';

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handle('on')}
          disabled={pending !== null}
          className={btn}
        >
          {pending === 'on' ? 'Turning on…' : 'On'}
        </button>
        <button
          type="button"
          onClick={() => handle('off')}
          disabled={pending !== null}
          className={btn}
        >
          {pending === 'off' ? 'Turning off…' : 'Off'}
        </button>
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
