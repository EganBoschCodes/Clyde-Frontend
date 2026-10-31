'use client';

import { useContext } from 'react';

import { RealtimeContext } from './RealtimeProvider';

interface RoomLive {
  activeRoutine: string | null | undefined;
  activeEvent: string | null | undefined;
  dimFactor: number | undefined;
}

export function useRoomLive(room: string): RoomLive {
  const { roomState, roomDim, roomEvent } = useContext(RealtimeContext);
  const state = roomState.get(room);
  return {
    activeRoutine: state ? state.active_routine : undefined,
    activeEvent: roomEvent.get(room),
    dimFactor: roomDim.get(room),
  };
}
