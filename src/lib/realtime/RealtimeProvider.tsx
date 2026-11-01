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

import type { Pin } from '@/lib/clyde';
import { roomLabel } from '@/lib/rooms/roomLabel';

import { fetchRoomsSnapshot } from './fetchRoomsSnapshot';
import type { LightOffEvent, LightOnEvent, RealtimeEvent, RoomStateEvent } from './messages';

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;

type RoomStateMap = Map<string, { active_routine: string | null }>;
type RoomDimMap = Map<string, number>;
type RoomEventMap = Map<string, string | null>;
type RoomLabelMap = Map<string, string>;
type LightPinMap = Map<string, Pin | null>;
type LightOnSubscriber = (event: LightOnEvent) => void;
type LightOffSubscriber = (event: LightOffEvent) => void;
type RoomStateSubscriber = (event: RoomStateEvent) => void;

export interface RoomLivePatch {
  activeRoutine?: string | null;
  activeEvent?: string | null;
  dim?: number;
}

interface RealtimeContextValue {
  roomState: RoomStateMap;
  roomDim: RoomDimMap;
  roomEvent: RoomEventMap;
  roomLabels: RoomLabelMap;
  lightPin: LightPinMap;
  isConnected: boolean;
  resyncCount: number;
  patchRoomLive: (room: string, patch: RoomLivePatch) => void;
  setLightPin: (room: string | null, light: string, pin: Pin | null) => void;
  clearRoomPins: (room: string) => void;
  subscribeLightOn: (cb: LightOnSubscriber) => () => void;
  subscribeLightOff: (cb: LightOffSubscriber) => () => void;
  subscribeRoomState: (cb: RoomStateSubscriber) => () => void;
}

const noopUnsubscribe = () => {};

export const RealtimeContext = createContext<RealtimeContextValue>({
  roomState: new Map(),
  roomDim: new Map(),
  roomEvent: new Map(),
  roomLabels: new Map(),
  lightPin: new Map(),
  isConnected: true,
  resyncCount: 0,
  patchRoomLive: () => {},
  setLightPin: () => {},
  clearRoomPins: () => {},
  subscribeLightOn: () => noopUnsubscribe,
  subscribeLightOff: () => noopUnsubscribe,
  subscribeRoomState: () => noopUnsubscribe,
});

interface RealtimeProviderProps {
  children: ReactNode;
}

function withEntry<V>(map: Map<string, V>, key: string, value: V): Map<string, V> {
  const next = new Map(map);
  next.set(key, value);
  return next;
}

export default function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [roomState, setRoomState] = useState<RoomStateMap>(new Map());
  const [roomDim, setRoomDim] = useState<RoomDimMap>(new Map());
  const [roomEvent, setRoomEvent] = useState<RoomEventMap>(new Map());
  const [roomLabels, setRoomLabels] = useState<RoomLabelMap>(new Map());
  const [lightPin, setLightPinMap] = useState<LightPinMap>(new Map());
  const [isConnected, setIsConnected] = useState(true);
  const [resyncCount, setResyncCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const backoffRef = useRef(INITIAL_BACKOFF_MS);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelled = useRef(false);
  const lastMessageAt = useRef<Map<string, number>>(new Map());
  const roomLights = useRef<Map<string, string[]>>(new Map());
  const lightSubscribers = useRef<Set<LightOnSubscriber>>(new Set());
  const lightOffSubscribers = useRef<Set<LightOffSubscriber>>(new Set());
  const roomStateSubscribers = useRef<Set<RoomStateSubscriber>>(new Set());

  const subscribeLightOn = useCallback((cb: LightOnSubscriber) => {
    lightSubscribers.current.add(cb);
    return () => {
      lightSubscribers.current.delete(cb);
    };
  }, []);

  const subscribeLightOff = useCallback((cb: LightOffSubscriber) => {
    lightOffSubscribers.current.add(cb);
    return () => {
      lightOffSubscribers.current.delete(cb);
    };
  }, []);

  const subscribeRoomState = useCallback((cb: RoomStateSubscriber) => {
    roomStateSubscribers.current.add(cb);
    return () => {
      roomStateSubscribers.current.delete(cb);
    };
  }, []);

  const patchRoomLive = useCallback((room: string, patch: RoomLivePatch) => {
    lastMessageAt.current.set(room, performance.now());
    if (patch.activeRoutine !== undefined) {
      const routine = patch.activeRoutine;
      setRoomState(prev => withEntry(prev, room, { active_routine: routine }));
    }
    if (patch.activeEvent !== undefined) {
      const event = patch.activeEvent;
      setRoomEvent(prev => withEntry(prev, room, event));
    }
    if (patch.dim !== undefined) {
      const dim = patch.dim;
      setRoomDim(prev => withEntry(prev, room, dim));
    }
  }, []);

  const setLightPin = useCallback((room: string | null, light: string, pin: Pin | null) => {
    if (room) lastMessageAt.current.set(room, performance.now());
    setLightPinMap(prev => withEntry(prev, light, pin));
  }, []);

  const clearRoomPins = useCallback((room: string) => {
    lastMessageAt.current.set(room, performance.now());
    const lights = roomLights.current.get(room) ?? [];
    setLightPinMap(prev => {
      const next = new Map(prev);
      for (const light of lights) next.set(light, null);
      return next;
    });
  }, []);

  const resync = useCallback(async () => {
    const startedAt = performance.now();
    const [rooms, error] = await fetchRoomsSnapshot();
    if (error || cancelled.current) return;

    // Skip rooms that received a live message after the fetch started
    const fresh = rooms.filter(r => (lastMessageAt.current.get(r.name) ?? 0) < startedAt);
    setRoomLabels(new Map(rooms.map(r => [r.name, roomLabel(r)])));
    setRoomState(prev => {
      const next = new Map(prev);
      for (const r of fresh) next.set(r.name, { active_routine: r.active_routine });
      return next;
    });
    setRoomDim(prev => {
      const next = new Map(prev);
      for (const r of fresh) next.set(r.name, r.dim_factor);
      return next;
    });
    setRoomEvent(prev => {
      const next = new Map(prev);
      for (const r of fresh) next.set(r.name, r.active_event ?? null);
      return next;
    });
    for (const r of rooms) roomLights.current.set(r.name, r.lights);
    setLightPinMap(prev => {
      const next = new Map(prev);
      for (const r of fresh) {
        for (const light of r.lights) next.set(light, r.pins?.[light] ?? null);
      }
      return next;
    });
    setResyncCount(count => count + 1);
  }, []);

  useEffect(() => {
    cancelled.current = false;
    void resync();

    const url = process.env['NEXT_PUBLIC_CLYDE_WS_URL'];
    let hasConnectedBefore = false;

    function handleMessage(e: MessageEvent<string>) {
      let evt: RealtimeEvent;
      try {
        evt = JSON.parse(e.data) as RealtimeEvent;
      } catch {
        return;
      }
      if (evt.type === 'light_on') {
        for (const cb of lightSubscribers.current) cb(evt);
        return;
      }
      if (evt.type === 'light_off') {
        for (const cb of lightOffSubscribers.current) cb(evt);
        return;
      }
      if (evt.type === 'light_pin') {
        setLightPin(evt.room, evt.light, evt.pin);
        return;
      }
      if (evt.type === 'room_state') {
        patchRoomLive(evt.room, { activeRoutine: evt.active_routine });
        for (const cb of roomStateSubscribers.current) cb(evt);
        return;
      }
      if (evt.type === 'room_dim') {
        patchRoomLive(evt.room, { dim: evt.factor });
        return;
      }
      if (evt.type === 'room_event') {
        patchRoomLive(evt.room, { activeEvent: evt.active_event });
        return;
      }
    }

    function connect() {
      if (cancelled.current || !url) return;
      const existing = wsRef.current;
      if (existing && existing.readyState <= WebSocket.OPEN) return;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        backoffRef.current = INITIAL_BACKOFF_MS;
        setIsConnected(true);
        if (hasConnectedBefore) void resync();
        hasConnectedBefore = true;
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        if (wsRef.current === ws) wsRef.current = null;
        if (cancelled.current) return;
        setIsConnected(false);
        const delay = backoffRef.current;
        backoffRef.current = Math.min(delay * 2, MAX_BACKOFF_MS);
        reconnectTimer.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    function handleVisibility() {
      if (document.visibilityState !== 'visible') return;
      void resync();
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) return;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      backoffRef.current = INITIAL_BACKOFF_MS;
      connect();
    }

    if (url) connect();
    else console.warn('NEXT_PUBLIC_CLYDE_WS_URL not set — realtime disabled');
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled.current = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [resync, patchRoomLive, setLightPin]);

  const value = useMemo<RealtimeContextValue>(
    () => ({
      roomState,
      roomDim,
      roomEvent,
      roomLabels,
      lightPin,
      isConnected,
      resyncCount,
      patchRoomLive,
      setLightPin,
      clearRoomPins,
      subscribeLightOn,
      subscribeLightOff,
      subscribeRoomState,
    }),
    [
      roomState,
      roomDim,
      roomEvent,
      roomLabels,
      lightPin,
      isConnected,
      resyncCount,
      patchRoomLive,
      setLightPin,
      clearRoomPins,
      subscribeLightOn,
      subscribeLightOff,
      subscribeRoomState,
    ],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}
