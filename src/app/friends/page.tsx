'use client';

import { useState } from 'react';

type Result<T, E = Error> = [T, null] | [null, E];

interface MiniPartyResponse {
  rooms: string[];
  failed: Record<string, string>;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'firing' }
  | { kind: 'fired'; count: number }
  | { kind: 'partial'; count: number; failed: Record<string, string> }
  | { kind: 'error'; message: string };

async function fireMiniParty(): Promise<Result<MiniPartyResponse>> {
  let res: Response;
  try {
    res = await fetch('/api/clyde/friends/mini-party', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return [null, new Error(`HTTP ${res.status}${text ? `: ${text}` : ''}`)];
  }
  const body = (await res.json()) as MiniPartyResponse;
  return [body, null];
}

function renderStatus(status: Status): string {
  switch (status.kind) {
    case 'idle':
      return '';
    case 'firing':
      return 'Firing mini party on every room…';
    case 'fired':
      return `Fired on ${status.count} room${status.count === 1 ? '' : 's'}.`;
    case 'partial': {
      const failedNames = Object.keys(status.failed).join(', ');
      return `Fired on ${status.count}; failed: ${failedNames}`;
    }
    case 'error':
      return status.message;
    default: {
      const _exhaustive: never = status;
      throw new Error(`Unhandled status: ${String(_exhaustive)}`);
    }
  }
}

export default function FriendsPage() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const handleClick = async () => {
    if (status.kind === 'firing') return;
    setStatus({ kind: 'firing' });

    const [resp, err] = await fireMiniParty();
    if (err) {
      setStatus({ kind: 'error', message: err.message });
      return;
    }
    if (Object.keys(resp.failed).length > 0) {
      setStatus({ kind: 'partial', count: resp.rooms.length, failed: resp.failed });
      return;
    }
    setStatus({ kind: 'fired', count: resp.rooms.length });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={handleClick}
          disabled={status.kind === 'firing'}
          className="h-64 w-64 rounded-full bg-fuchsia-600 text-white text-3xl font-semibold tracking-tight shadow-2xl shadow-fuchsia-600/40 transition hover:bg-fuchsia-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status.kind === 'firing' ? 'Starting…' : 'Mini Party'}
        </button>
        <p className="h-5 text-sm text-zinc-500" aria-live="polite">
          {renderStatus(status)}
        </p>
      </div>
    </div>
  );
}
