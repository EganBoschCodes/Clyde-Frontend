'use client';

import { useContext } from 'react';

import { RealtimeContext } from './RealtimeProvider';

interface RoomLive {
  activeRoutine: string | null | undefined;
  dimFactor: number | undefined;
}

export function useRoomLive(room: string): RoomLive {
  const { roomState, roomDim } = useContext(RealtimeContext);
  const state = roomState.get(room);
  return {
    activeRoutine: state ? state.active_routine : undefined,
    dimFactor: roomDim.get(room),
  };
}
