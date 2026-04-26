'use client';

import { useEffect, useRef, useState } from 'react';

import { useRoomLive } from '@/lib/realtime/useRoomLive';

import { Select, Toggle } from '../shared/Control';
import * as S from './styles';

const DAYLIGHT_ROUTINE = 'daylight';
const DIM_COMMIT_DELAY_MS = 200;
const DIM_MIN = 0;
const DIM_MAX = 1;
const DIM_STEP = 0.01;

type Action = 'routine' | 'off' | 'dim';

interface RoomControlsProps {
  room: string;
  routines: string[];
  activeRoutine: string | null;
  dimFactor: number;
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

async function setRoomDim(room: string, factor: number): Promise<Error | null> {
  const url = `/api/clyde/rooms/${encodeURIComponent(room)}/dim`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ room, factor }),
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

export default function RoomControls({ room, routines, activeRoutine, dimFactor }: RoomControlsProps) {
  const live = useRoomLive(room);
  const effectiveRoutine =
    live.activeRoutine !== undefined ? live.activeRoutine : activeRoutine;
  const effectiveDim = live.dimFactor !== undefined ? live.dimFactor : dimFactor;
  const isOn = effectiveRoutine !== null;
  const [pending, setPending] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(() => initialSelection(activeRoutine, routines));
  const [optimisticOn, setOptimisticOn] = useState<boolean>(isOn);
  const [dim, setDim] = useState<number>(dimFactor);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOptimisticOn(isOn);
  }, [isOn]);

  useEffect(() => {
    if (pending !== 'dim') setDim(effectiveDim);
  }, [effectiveDim, pending]);

  useEffect(() => {
    return () => {
      if (commitTimer.current) clearTimeout(commitTimer.current);
    };
  }, []);

  async function applyRoutine(routine: string) {
    if (!routine) return;
    setPending('routine');
    setError(null);
    setOptimisticOn(true);
    const err = await setRoomRoutine(room, routine);
    setPending(null);
    if (err) {
      setOptimisticOn(isOn);
      setError(err.message);
    }
  }

  async function turnOff() {
    setPending('off');
    setError(null);
    setOptimisticOn(false);
    const err = await turnRoomLightsOff(room);
    setPending(null);
    if (err) {
      setOptimisticOn(isOn);
      setError(err.message);
    }
  }

  async function commitDim(factor: number) {
    setPending('dim');
    setError(null);
    const err = await setRoomDim(room, factor);
    setPending(null);
    if (err) {
      setError(err.message);
    }
  }

  const handleDimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setDim(next);
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => {
      void commitDim(next);
    }, DIM_COMMIT_DELAY_MS);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setSelected(next);
    if (optimisticOn && next) void applyRoutine(next);
  };

  const handleToggle = () => {
    if (optimisticOn) {
      void turnOff();
      return;
    }
    void applyRoutine(selected);
  };

  const toggleDisabled = pending !== null || (!optimisticOn && !selected);

  return (
    <S.Container>
      <S.Row>
        {routines.length > 0 ? (
          <Select
            $size="sm"
            value={selected}
            onChange={handleSelectChange}
            disabled={pending !== null}
          >
            {routines.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        ) : null}
        <Toggle
          type="button"
          role="switch"
          aria-checked={optimisticOn}
          aria-label={`${room} lights ${optimisticOn ? 'on' : 'off'}`}
          $on={optimisticOn}
          onClick={handleToggle}
          disabled={toggleDisabled}
        />
      </S.Row>
      <S.DimRow>
        <S.DimLabel>Dim</S.DimLabel>
        <S.DimSlider
          type="range"
          min={DIM_MIN}
          max={DIM_MAX}
          step={DIM_STEP}
          value={dim}
          onChange={handleDimChange}
          disabled={pending !== null && pending !== 'dim'}
          aria-label={`${room} dim factor`}
        />
        <S.DimValue>{Math.round(dim * 100)}%</S.DimValue>
      </S.DimRow>
      {pending === 'routine' ? <S.Status>Applying {selected}…</S.Status> : null}
      {error ? <S.Error>{error}</S.Error> : null}
    </S.Container>
  );
}
