'use client';

import { useEffect, useRef, useState } from 'react';

import { useRoomLive } from '@/lib/realtime/useRoomLive';
import { setRoomDim } from '@/lib/roomApi/setRoomDim';
import { setRoomRoutine } from '@/lib/roomApi/setRoomRoutine';
import { turnRoomLightsOff } from '@/lib/roomApi/turnRoomLightsOff';

import DimControl from '../DimControl';
import { Select, Toggle } from '../shared/Control';
import * as S from './styles';

const DAYLIGHT_ROUTINE = 'daylight';
const DIM_COMMIT_DELAY_MS = 200;

type Action = 'routine' | 'off' | 'dim';

interface RoomControlsProps {
  room: string;
  routines: string[];
  activeRoutine: string | null;
  dimFactor: number;
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
  const [isDragging, setIsDragging] = useState(false);
  const [isDimDirty, setIsDimDirty] = useState(false);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOptimisticOn(isOn);
  }, [isOn]);

  useEffect(() => {
    if (isDragging || isDimDirty) return;
    setDim(effectiveDim);
  }, [effectiveDim, isDragging, isDimDirty]);

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
    setIsDimDirty(false);
    if (err) {
      setError(err.message);
    }
  }

  const handleDimChange = (next: number) => {
    setDim(next);
    setIsDimDirty(true);
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
      <S.DimWrap>
        <DimControl
          value={dim}
          label={`${room} brightness`}
          onChange={handleDimChange}
          onActiveChange={setIsDragging}
        />
      </S.DimWrap>
      {error ? <S.Error>{error}</S.Error> : null}
    </S.Container>
  );
}
