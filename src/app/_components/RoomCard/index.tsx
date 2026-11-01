'use client';

import { useContext, useRef, useState } from 'react';

import type { Pin, RoutineInfo } from '@/lib/clyde';
import { useRoomPins } from '@/lib/lights/useRoomPins';
import { RealtimeContext } from '@/lib/realtime/RealtimeProvider';
import { useRoomGlow } from '@/lib/realtime/useRoomGlow';
import { useRoomLive } from '@/lib/realtime/useRoomLive';
import { setRoomRoutine } from '@/lib/roomApi/setRoomRoutine';
import { turnRoomLightsOff } from '@/lib/roomApi/turnRoomLightsOff';
import { routineLabel } from '@/lib/rooms/routineLabel';
import { useRoomDimControl } from '@/lib/rooms/useRoomDimControl';
import { titleCase } from '@/lib/text/titleCase';
import { useTransientMessage } from '@/lib/ui/useTransientMessage';

import DimControl from '../DimControl';
import PowerButton from '../PowerButton';
import RoomEventStatus from '../RoomEventStatus';
import RoutineSheet from '../RoutineSheet';
import { glowStyle } from './glowStyle';
import * as S from './styles';

const DAYLIGHT_ROUTINE = 'daylight';

type PendingKind = 'power-on' | 'power-off' | 'routine';

interface RoomCardProps {
  room: string;
  label: string;
  lights: string[];
  routines: RoutineInfo[];
  activeRoutine: string | null;
  activeEvent: string | null;
  dimFactor: number;
  pins: Record<string, Pin>;
}

function defaultRoutine(routines: readonly RoutineInfo[]): string {
  if (routines.some(r => r.name === DAYLIGHT_ROUTINE)) return DAYLIGHT_ROUTINE;
  return routines[0]?.name ?? '';
}

export default function RoomCard({ room, label, lights, routines, activeRoutine, activeEvent, dimFactor, pins }: RoomCardProps) {
  const live = useRoomLive(room);
  const glow = useRoomGlow(room, lights);
  const { patchRoomLive, clearRoomPins } = useContext(RealtimeContext);
  const roomPins = useRoomPins(lights, pins);
  const pinnedCount = Object.keys(roomPins).length;
  const pinnedOnCount = Object.values(roomPins).filter(pin => pin.on).length;
  const effectiveRoutine = live.activeRoutine !== undefined ? live.activeRoutine : activeRoutine;
  const effectiveEvent = live.activeEvent !== undefined ? live.activeEvent : activeEvent;
  const effectiveDim = live.dimFactor !== undefined ? live.dimFactor : dimFactor;
  const isOn = effectiveRoutine !== null || pinnedOnCount > 0;

  const [pending, setPending] = useState<PendingKind | null>(null);
  const [error, showError] = useTransientMessage();
  const [lastRoutine, setLastRoutine] = useState<string | null>(activeRoutine);
  const [optimisticOn, setOptimisticOn] = useState<boolean>(isOn);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [seenIsOn, setSeenIsOn] = useState(isOn);
  const [seenRoutine, setSeenRoutine] = useState(effectiveRoutine);
  const isStartingRef = useRef(false);

  if (seenIsOn !== isOn) {
    setSeenIsOn(isOn);
    setOptimisticOn(isOn);
  }

  if (seenRoutine !== effectiveRoutine) {
    setSeenRoutine(effectiveRoutine);
    if (effectiveRoutine !== null) setLastRoutine(effectiveRoutine);
  }

  const routineName = (key: string): string => {
    const info = routines.find(r => r.name === key);
    return info ? routineLabel(info) : titleCase(key);
  };

  async function applyRoutine(routine: string, kind: PendingKind) {
    if (!routine) return;
    setPending(kind);
    showError(null);
    setOptimisticOn(true);
    setLastRoutine(routine);
    const err = await setRoomRoutine(room, routine);
    setPending(null);
    isStartingRef.current = false;
    if (err) {
      setOptimisticOn(isOn);
      showError(err.message);
      return;
    }
    clearRoomPins(room);
    patchRoomLive(room, { activeRoutine: routine });
  }

  async function turnOff() {
    setPending('power-off');
    showError(null);
    setOptimisticOn(false);
    const err = await turnRoomLightsOff(room);
    setPending(null);
    if (err) {
      setOptimisticOn(isOn);
      showError(err.message);
      return;
    }
    clearRoomPins(room);
    patchRoomLive(room, { activeRoutine: null });
  }

  const startIfOff = () => {
    if (optimisticOn || isStartingRef.current) return;
    isStartingRef.current = true;
    void applyRoutine(lastRoutine ?? defaultRoutine(routines), 'power-on');
  };

  const { dim, changeDim, cancelDim } = useRoomDimControl({
    room,
    serverDim: effectiveDim,
    onBeforeCommit: startIfOff,
    onError: showError,
  });

  const handleToggle = () => {
    if (optimisticOn) {
      void turnOff();
      return;
    }
    void applyRoutine(lastRoutine ?? defaultRoutine(routines), 'power-on');
  };

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  const handleSelectRoutine = (routine: string) => {
    setIsSheetOpen(false);
    void applyRoutine(routine, 'routine');
  };

  const isBusy = pending !== null;
  const isRoutineShown = optimisticOn && (effectiveRoutine !== null || pinnedOnCount === 0);
  const pillText = isRoutineShown
    ? routineName(effectiveRoutine ?? lastRoutine ?? '')
    : lastRoutine
      ? `Last: ${routineName(lastRoutine)}`
      : 'Routines';
  const pillLabel = pending === 'routine' ? 'Applying…' : pillText;

  return (
    <S.Card $isOn={optimisticOn} style={optimisticOn ? glowStyle(glow) : undefined}>
      <S.Header>
        <S.Titles>
          <S.Name>{label}</S.Name>
          <S.PillRow>
            {routines.length > 0 ? (
              <S.RoutinePill
                type="button"
                aria-haspopup="dialog"
                aria-label={`${label} routine: ${pillText}. Change routine`}
                disabled={isBusy}
                onClick={openSheet}
              >
                <S.PillText>{pillLabel}</S.PillText>
                <S.Chevron aria-hidden="true">▾</S.Chevron>
              </S.RoutinePill>
            ) : null}
            {pinnedCount > 0 ? (
              <S.PinLink href="/lights" aria-label={`${label}: ${pinnedCount} pinned. Open lights`}>
                {pinnedCount} pinned
              </S.PinLink>
            ) : null}
          </S.PillRow>
        </S.Titles>
        <PowerButton
          isOn={optimisticOn}
          isPending={pending === 'power-on' || pending === 'power-off'}
          label={`${label} lights`}
          isDisabled={isBusy}
          onToggle={handleToggle}
        />
      </S.Header>
      {effectiveEvent ? <RoomEventStatus room={room} event={effectiveEvent} /> : null}
      <DimControl
        value={dim}
        label={`${label} brightness`}
        isOn={optimisticOn}
        onChange={changeDim}
        onCancel={cancelDim}
      />
      {error ? <S.Error role="alert">{error}</S.Error> : null}
      {isSheetOpen ? (
        <RoutineSheet
          roomLabel={label}
          routines={routines}
          current={optimisticOn ? effectiveRoutine : null}
          onSelect={handleSelectRoutine}
          onClose={closeSheet}
        />
      ) : null}
    </S.Card>
  );
}
