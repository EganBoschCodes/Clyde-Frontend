'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DAYLIGHT_ROUTINE = 'daylight';

type Action = 'routine' | 'off';

interface RoomControlsProps {
  room: string;
  routines: string[];
  activeRoutine: string | null;
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

function initialSelection(activeRoutine: string | null, routines: string[]): string {
  if (activeRoutine && routines.includes(activeRoutine)) return activeRoutine;
  if (routines.includes(DAYLIGHT_ROUTINE)) return DAYLIGHT_ROUTINE;
  return routines[0] ?? '';
}

export default function RoomControls({ room, routines, activeRoutine }: RoomControlsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(() => initialSelection(activeRoutine, routines));

  async function applyRoutine(routine: string) {
    if (!routine) return;
    setPending('routine');
    setError(null);
    const err = await setRoomRoutine(room, routine);
    setPending(null);
    if (err) {
      setError(err.message);
      return;
    }
    router.refresh();
  }

  async function turnOff() {
    setPending('off');
    setError(null);
    const err = await turnRoomLightsOff(room);
    setPending(null);
    if (err) {
      setError(err.message);
      return;
    }
    router.refresh();
  }

  const ctrl =
    'rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50';

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        {routines.length > 0 ? (
          <select
            value={selected}
            onChange={e => {
              const next = e.target.value;
              setSelected(next);
              void applyRoutine(next);
            }}
            disabled={pending !== null}
            className={ctrl}
          >
            {routines.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        ) : null}
        <button
          type="button"
          onClick={turnOff}
          disabled={pending !== null}
          className={ctrl}
        >
          {pending === 'off' ? 'Turning off…' : 'Off'}
        </button>
      </div>
      {pending === 'routine' ? (
        <p className="text-xs text-zinc-500">Applying {selected}…</p>
      ) : null}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
