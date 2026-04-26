'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { LightOnEvent, RealtimeEvent } from './messages';

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;

type RoomStateMap = Map<string, { active_routine: string | null }>;
type RoomDimMap = Map<string, number>;
type LightOnSubscriber = (event: LightOnEvent) => void;

interface RealtimeContextValue {
  roomState: RoomStateMap;
  roomDim: RoomDimMap;
  subscribeLightOn: (cb: LightOnSubscriber) => () => void;
}

const noopUnsubscribe = () => {};

export const RealtimeContext = createContext<RealtimeContextValue>({
  roomState: new Map(),
  roomDim: new Map(),
  subscribeLightOn: () => noopUnsubscribe,
});

interface RealtimeProviderProps {
  children: ReactNode;
}

export default function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [roomState, setRoomState] = useState<RoomStateMap>(new Map());
  const [roomDim, setRoomDim] = useState<RoomDimMap>(new Map());
  const wsRef = useRef<WebSocket | null>(null);
  const backoffRef = useRef(INITIAL_BACKOFF_MS);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelled = useRef(false);
  const lightSubscribers = useRef<Set<LightOnSubscriber>>(new Set());

  const subscribeLightOn = useCallback((cb: LightOnSubscriber) => {
    lightSubscribers.current.add(cb);
    return () => {
      lightSubscribers.current.delete(cb);
    };
  }, []);

  useEffect(() => {
    cancelled.current = false;
    const url = process.env['NEXT_PUBLIC_CLYDE_WS_URL'];
    if (!url) {
      console.warn('NEXT_PUBLIC_CLYDE_WS_URL not set — realtime disabled');
      return;
    }

    function connect() {
      if (cancelled.current) return;
      const ws = new WebSocket(url!);
      wsRef.current = ws;

      ws.onopen = () => {
        backoffRef.current = INITIAL_BACKOFF_MS;
      };

      ws.onmessage = e => {
        let evt: RealtimeEvent;
        try {
          evt = JSON.parse(e.data) as RealtimeEvent;
        } catch {
          return;
        }
        if (evt.type === 'room_state') {
          setRoomState(prev => {
            const next = new Map(prev);
            next.set(evt.room, { active_routine: evt.active_routine });
            return next;
          });
          return;
        }
        if (evt.type === 'room_dim') {
          setRoomDim(prev => {
            const next = new Map(prev);
            next.set(evt.room, evt.factor);
            return next;
          });
          return;
        }
        if (evt.type === 'light_on') {
          for (const cb of lightSubscribers.current) cb(evt);
          return;
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (cancelled.current) return;
        const delay = backoffRef.current;
        backoffRef.current = Math.min(delay * 2, MAX_BACKOFF_MS);
        reconnectTimer.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      cancelled.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  const value = useMemo<RealtimeContextValue>(
    () => ({ roomState, roomDim, subscribeLightOn }),
    [roomState, roomDim, subscribeLightOn],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}
