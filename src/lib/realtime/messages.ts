import type { Pin } from '@/lib/clyde';

export interface RoomStateEvent {
  type: 'room_state';
  room: string;
  active_routine: string | null;
}

export interface RoomDimEvent {
  type: 'room_dim';
  room: string;
  factor: number;
}

export interface RoomEventEvent {
  type: 'room_event';
  room: string;
  active_event: string | null;
}

export interface LightOnEvent {
  type: 'light_on';
  room: string;
  light: string;
  rgb_color: [number, number, number] | null;
  brightness: number | null;
  transition: number | null;
}

export interface LightOffEvent {
  type: 'light_off';
  room: string;
  light: string;
  transition: number | null;
}

export interface LightPinEvent {
  type: 'light_pin';
  room: string;
  light: string;
  pin: Pin | null;
}

export type RealtimeEvent =
  | RoomStateEvent
  | RoomDimEvent
  | RoomEventEvent
  | LightOnEvent
  | LightOffEvent
  | LightPinEvent;
