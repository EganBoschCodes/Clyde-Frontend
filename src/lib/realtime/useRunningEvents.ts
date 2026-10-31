'use client';

import { useContext } from 'react';

import { titleCase } from '@/lib/text/titleCase';

import { RealtimeContext } from './RealtimeProvider';

export interface RunningEvent {
  room: string;
  roomLabel: string;
  event: string;
}

export function useRunningEvents(): RunningEvent[] {
  const { roomEvent, roomLabels } = useContext(RealtimeContext);
  const running: RunningEvent[] = [];
  for (const [room, event] of roomEvent) {
    if (!event) continue;
    running.push({ room, roomLabel: roomLabels.get(room) ?? titleCase(room), event });
  }
  return running;
}
