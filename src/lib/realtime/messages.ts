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

export type RealtimeEvent = RoomStateEvent | RoomDimEvent;
