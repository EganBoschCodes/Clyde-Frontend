'use client';

import { useContext } from 'react';

import { RealtimeContext } from './RealtimeProvider';

export function useConnectionStatus(): boolean {
  return useContext(RealtimeContext).isConnected;
}
