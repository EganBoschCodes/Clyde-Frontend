'use client';

import { useEffect, useRef, useState } from 'react';

import { useRoomGlow } from '@/lib/realtime/useRoomGlow';
import { useRoomLive } from '@/lib/realtime/useRoomLive';
import { setRoomDim } from '@/lib/roomApi/setRoomDim';
import { setRoomRoutine } from '@/lib/roomApi/setRoomRoutine';
import { turnRoomLightsOff } from '@/lib/roomApi/turnRoomLightsOff';
import { titleCase } from '@/lib/text/titleCase';

import DimControl from '../DimControl';
import PowerButton from '../PowerButton';
import RoutineChips from '../RoutineChips';
import { glowStyle } from './glowStyle';
import * as S from './styles';

const DAYLIGHT_ROUTINE = 'daylight';
const DIM_COMMIT_DELAY_MS = 200;

type Action = 'routine' | 'off' | 'dim';

interface RoomCardProps {
  room: string;
  label: string;
  lightCount: number;
  routines: string[];
  activeRoutine: string | null;
  dimFactor: number;
}

function initialSelection(activeRoutine: string | null, routines: string[]): string {
  if (activeRoutine && routines.includes(activeRoutine)) return activeRoutine;
  if (routines.includes(DAYLIGHT_ROUTINE)) return DAYLIGHT_ROUTINE;
  return routines[0] ?? '';
}

export default function RoomCard({ room, label, lightCount, routines, activeRoutine, dimFactor }: RoomCardProps) {
  const live = useRoomLive(room);
  const glow = useRoomGlow(room);
  const effectiveRoutine = live.activeRoutine !== undefined ? live.activeRoutine : activeRoutine;
  const effectiveDim = live.dimFactor !== undefined ? live.dimFactor : dimFactor;
  const isOn = effectiveRoutine !== null;

  const [pending, setPending] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(() => initialSelection(activeRoutine, routines));
  const [optimisticOn, setOptimisticOn] = useState<boolean>(isOn);
  const [dim, setDim] = useState<number>(effectiveDim);
  const [isDragging, setIsDragging] = useState(false);
  const [isDimDirty, setIsDimDirty] = useState(false);
  const [seenIsOn, setSeenIsOn] = useState(isOn);
  const [seenRoutine, setSeenRoutine] = useState(effectiveRoutine);
  const [seenDim, setSeenDim] = useState(effectiveDim);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (seenIsOn !== isOn) {
    setSeenIsOn(isOn);
    setOptimisticOn(isOn);
  }

  if (seenRoutine !== effectiveRoutine) {
    setSeenRoutine(effectiveRoutine);
    if (effectiveRoutine !== null && routines.includes(effectiveRoutine)) setSelected(effectiveRoutine);
  }

  if (seenDim !== effectiveDim) {
    setSeenDim(effectiveDim);
    if (!isDragging && !isDimDirty) setDim(effectiveDim);
  }

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
    if (!err) return;
    setOptimisticOn(isOn);
    setError(err.message);
  }

  async function turnOff() {
    setPending('off');
    setError(null);
    setOptimisticOn(false);
    const err = await turnRoomLightsOff(room);
    setPending(null);
    if (!err) return;
    setOptimisticOn(isOn);
    setError(err.message);
  }

  async function commitDim(factor: number) {
    setPending('dim');
    setError(null);
    const err = await setRoomDim(room, factor);
    setPending(null);
    setIsDimDirty(false);
    if (err) setError(err.message);
  }

  const handleDimChange = (next: number) => {
    setDim(next);
    setIsDimDirty(true);
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => {
      void commitDim(next);
    }, DIM_COMMIT_DELAY_MS);
  };

  const handleSelect = (routine: string) => {
    setSelected(routine);
    if (optimisticOn) void applyRoutine(routine);
  };

  const handleToggle = () => {
    if (optimisticOn) {
      void turnOff();
      return;
    }
    void applyRoutine(selected);
  };

  const isBusy = pending === 'routine' || pending === 'off';
  const toggleDisabled = isBusy || (!optimisticOn && !selected);
  const runningRoutine = effectiveRoutine ?? selected;
  const statusText = optimisticOn ? titleCase(runningRoutine) : 'Off';
  const lightsText = `${lightCount} light${lightCount === 1 ? '' : 's'}`;

  return (
    <S.Card $isOn={optimisticOn} style={glowStyle(glow)}>
      <S.Header>
        <S.Titles>
          <S.Name>{label}</S.Name>
          <S.Meta>
            <S.Status $isOn={optimisticOn}>{statusText}</S.Status>
            <span>{Math.round(dim * 100)}%</span>
            <span>{lightsText}</span>
          </S.Meta>
        </S.Titles>
        <PowerButton
          isOn={optimisticOn}
          label={`${label} lights ${optimisticOn ? 'on' : 'off'}`}
          isDisabled={toggleDisabled}
          onToggle={handleToggle}
        />
      </S.Header>
      {routines.length > 0 ? (
        <RoutineChips
          routines={routines}
          selected={selected}
          isOn={optimisticOn}
          isDisabled={isBusy}
          onSelect={handleSelect}
        />
      ) : null}
      <DimControl
        value={dim}
        label={`${label} brightness`}
        onChange={handleDimChange}
        onActiveChange={setIsDragging}
      />
      {error ? <S.Error role="alert">{error}</S.Error> : null}
    </S.Card>
  );
}
