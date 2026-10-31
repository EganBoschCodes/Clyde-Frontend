'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CLEAR_AFTER_MS = 5000;

export function useTransientMessage(): [string | null, (message: string | null) => void] {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: string | null) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setMessage(next);
    if (next === null) return;
    timer.current = setTimeout(() => setMessage(null), CLEAR_AFTER_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return [message, show];
}
