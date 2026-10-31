'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { previewStudioRoutine } from './previewStudioRoutine';
import { stopRoomRoutine } from './stopRoomRoutine';
import { PREVIEW_DEBOUNCE_MS, type StudioSpec } from './types';

interface StudioPreview {
  room: string;
  isOn: boolean;
  error: string | null;
  setRoom: (room: string) => void;
  start: () => void;
  stop: () => void;
  detach: () => void;
}

export function useStudioPreview(spec: StudioSpec, isValid: boolean, initialRoom: string): StudioPreview {
  const [room, setRoomState] = useState(initialRoom);
  const [isOn, setIsOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queueRef = useRef<Promise<unknown>>(Promise.resolve());
  const isOnRef = useRef(false);
  const roomRef = useRef(initialRoom);

  const specKey = JSON.stringify(spec);

  // Serialize requests so a late preview never lands after a stop
  const enqueue = useCallback((task: () => Promise<Error | null>) => {
    const run = queueRef.current.then(task);
    queueRef.current = run;
    return run;
  }, []);

  const setOn = useCallback((next: boolean) => {
    isOnRef.current = next;
    setIsOn(next);
  }, []);

  useEffect(() => {
    if (!isOn || !isValid) return;

    const payload: StudioSpec = JSON.parse(specKey);
    const timer = setTimeout(async () => {
      const failure = await enqueue(() => previewStudioRoutine(room, payload));
      setError(failure ? failure.message : null);
    }, PREVIEW_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [isOn, isValid, room, specKey, enqueue]);

  // Never leave an unsaved preview running after leaving the editor
  useEffect(() => {
    return () => {
      if (!isOnRef.current) return;
      void stopRoomRoutine(roomRef.current);
    };
  }, []);

  const setRoom = (next: string) => {
    if (next === roomRef.current) return;
    const previous = roomRef.current;
    roomRef.current = next;
    setRoomState(next);
    if (isOnRef.current) void enqueue(() => stopRoomRoutine(previous));
  };

  const start = () => {
    setError(null);
    setOn(true);
  };

  const stop = () => {
    setOn(false);
    setError(null);
    void enqueue(() => stopRoomRoutine(roomRef.current));
  };

  // Hand the room over to a saved routine without stopping it
  const detach = () => {
    setOn(false);
    setError(null);
  };

  return { room, isOn, error, setRoom, start, stop, detach };
}
