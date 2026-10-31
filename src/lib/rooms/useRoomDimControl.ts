'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { setRoomDim } from '@/lib/roomApi/setRoomDim';

const THROTTLE_MS = 150;
const ECHO_GRACE_MS = 400;

interface Options {
  room: string;
  serverDim: number;
  onBeforeCommit: () => void;
  onError: (message: string) => void;
}

interface RoomDimControl {
  dim: number;
  changeDim: (next: number, isFinal: boolean) => void;
  cancelDim: (original: number) => void;
}

export function useRoomDimControl({ room, serverDim, onBeforeCommit, onError }: Options): RoomDimControl {
  const [dim, setDim] = useState(serverDim);
  const [isDirty, setIsDirty] = useState(false);
  const [seenServerDim, setSeenServerDim] = useState(serverDim);
  const latest = useRef(serverDim);
  const seq = useRef(0);
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const graceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSentInGesture = useRef(false);
  const callbacks = useRef({ onBeforeCommit, onError });

  useEffect(() => {
    callbacks.current = { onBeforeCommit, onError };
  });

  // Accept server values only when no local change is in flight
  if (seenServerDim !== serverDim) {
    setSeenServerDim(serverDim);
    if (!isDirty) setDim(serverDim);
  }

  useEffect(() => {
    return () => {
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
      if (graceTimer.current) clearTimeout(graceTimer.current);
    };
  }, []);

  const send = useCallback(
    async (value: number) => {
      const mine = ++seq.current;
      hasSentInGesture.current = true;
      callbacks.current.onBeforeCommit();
      const err = await setRoomDim(room, value);
      if (mine !== seq.current) return;
      if (err) {
        callbacks.current.onError(err.message);
        setIsDirty(false);
        return;
      }
      if (graceTimer.current) clearTimeout(graceTimer.current);
      graceTimer.current = setTimeout(() => setIsDirty(false), ECHO_GRACE_MS);
    },
    [room],
  );

  const changeDim = useCallback(
    (next: number, isFinal: boolean) => {
      latest.current = next;
      setDim(next);
      setIsDirty(true);
      if (graceTimer.current) clearTimeout(graceTimer.current);

      if (isFinal) {
        if (throttleTimer.current) clearTimeout(throttleTimer.current);
        throttleTimer.current = null;
        void send(next);
        hasSentInGesture.current = false;
        return;
      }
      if (throttleTimer.current) return;
      throttleTimer.current = setTimeout(() => {
        throttleTimer.current = null;
        void send(latest.current);
      }, THROTTLE_MS);
    },
    [send],
  );

  const cancelDim = useCallback(
    (original: number) => {
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
      throttleTimer.current = null;
      latest.current = original;
      setDim(original);
      const needsRestore = hasSentInGesture.current;
      hasSentInGesture.current = false;
      if (needsRestore) {
        void send(original);
        hasSentInGesture.current = false;
        return;
      }
      setIsDirty(false);
    },
    [send],
  );

  return { dim, changeDim, cancelDim };
}
