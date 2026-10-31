'use client';

import { useCallback, useContext, useState } from 'react';

import { RealtimeContext } from '@/lib/realtime/RealtimeProvider';
import { cancelRoomEvent } from '@/lib/roomApi/cancelRoomEvent';
import { useTransientMessage } from '@/lib/ui/useTransientMessage';

interface CancelRoomEvents {
  pendingRooms: ReadonlySet<string>;
  error: string | null;
  cancelRooms: (rooms: readonly string[]) => Promise<void>;
}

export function useCancelRoomEvents(): CancelRoomEvents {
  const { patchRoomLive } = useContext(RealtimeContext);
  const [pendingRooms, setPendingRooms] = useState<ReadonlySet<string>>(new Set());
  const [error, showError] = useTransientMessage();

  const cancelOne = useCallback(
    async (room: string) => {
      const err = await cancelRoomEvent(room);
      setPendingRooms(prev => new Set([...prev].filter(r => r !== room)));
      if (err) {
        showError(`Couldn't cancel: ${err.message}`);
        return;
      }
      patchRoomLive(room, { activeEvent: null });
    },
    [patchRoomLive, showError],
  );

  const cancelRooms = useCallback(
    async (rooms: readonly string[]) => {
      showError(null);
      setPendingRooms(prev => new Set([...prev, ...rooms]));
      await Promise.all(rooms.map(cancelOne));
    },
    [cancelOne, showError],
  );

  return { pendingRooms, error, cancelRooms };
}
