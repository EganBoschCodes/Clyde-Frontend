'use client';

import { useEffect, useState } from 'react';

import * as S from './styles';

interface MiniPartyResponse {
  rooms: string[];
  failed: Record<string, string>;
}

type FireResult =
  | { kind: 'ok'; body: MiniPartyResponse }
  | { kind: 'banned'; retryAfterSeconds: number }
  | { kind: 'error'; message: string };

type Status =
  | { kind: 'idle' }
  | { kind: 'firing' }
  | { kind: 'fired'; count: number }
  | { kind: 'partial'; count: number; failed: Record<string, string> }
  | { kind: 'banned'; bannedUntil: number }
  | { kind: 'error'; message: string };

async function fireMiniParty(): Promise<FireResult> {
  let res: Response;
  try {
    res = await fetch('/api/clyde/friends/mini-party', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
  } catch (e) {
    return { kind: 'error', message: e instanceof Error ? e.message : String(e) };
  }

  if (res.status === 429) {
    const retryAfterSeconds = Number(res.headers.get('retry-after')) || 0;
    return { kind: 'banned', retryAfterSeconds };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { kind: 'error', message: `HTTP ${res.status}${text ? `: ${text}` : ''}` };
  }

  const body = (await res.json()) as MiniPartyResponse;
  return { kind: 'ok', body };
}

function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function renderStatus(status: Status, now: number): string {
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
    case 'banned': {
      const remaining = formatRemaining(status.bannedUntil - now);
      return `Too many presses. Try again in ${remaining}.`;
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
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status.kind !== 'banned') return;
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status.kind]);

  const isBanned = status.kind === 'banned' && status.bannedUntil > now;
  const disabled = status.kind === 'firing' || isBanned;

  const handleClick = async () => {
    if (disabled) return;
    setStatus({ kind: 'firing' });

    const result = await fireMiniParty();
    switch (result.kind) {
      case 'banned':
        setStatus({ kind: 'banned', bannedUntil: Date.now() + result.retryAfterSeconds * 1000 });
        return;
      case 'error':
        setStatus({ kind: 'error', message: result.message });
        return;
      case 'ok': {
        const { body } = result;
        if (Object.keys(body.failed).length > 0) {
          setStatus({ kind: 'partial', count: body.rooms.length, failed: body.failed });
          return;
        }
        setStatus({ kind: 'fired', count: body.rooms.length });
        return;
      }
      default: {
        const _exhaustive: never = result;
        throw new Error(`Unhandled result: ${String(_exhaustive)}`);
      }
    }
  };

  const label = status.kind === 'firing' ? 'Starting…' : isBanned ? 'Cooling off' : 'Mini Party';

  return (
    <S.Screen>
      <S.Stack>
        <S.PartyButton type="button" onClick={handleClick} disabled={disabled}>
          {label}
        </S.PartyButton>
        <S.StatusText aria-live="polite">{renderStatus(status, now)}</S.StatusText>
      </S.Stack>
    </S.Screen>
  );
}
