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

export interface LightOnEvent {
  type: 'light_on';
  room: string;
  light: string;
  rgb_color: [number, number, number] | null;
  brightness: number | null;
  transition: number | null;
}

export type RealtimeEvent = RoomStateEvent | RoomDimEvent | LightOnEvent;
