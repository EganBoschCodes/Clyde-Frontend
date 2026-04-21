const DEFAULT_CLYDE_URL = 'http://localhost:8765';

export type Result<T, E = Error> = [T, null] | [null, E];

export interface StatusResponse {
  status: string;
  service: string;
}

export interface RoomStatus {
  name: string;
  lights: string[];
  active_routine: string | null;
  dim_factor: number;
}

export interface RoomsResponse {
  rooms: RoomStatus[];
}

export interface ScheduledEvent {
  event: string;
  room: string;
  time: string;
}

export interface SchedulesResponse {
  schedules: ScheduledEvent[];
}

export interface EventInfo {
  name: string;
}

export interface EventsResponse {
  events: EventInfo[];
}

export interface RoutineInfo {
  name: string;
  tick_interval: number;
}

export interface RoutinesResponse {
  routines: RoutineInfo[];
}

function backendUrl(): string {
  return process.env['CLYDE_BACKEND_URL'] ?? DEFAULT_CLYDE_URL;
}

async function getJson<T>(path: string): Promise<Result<T>> {
  const url = `${backendUrl()}${path}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: 'no-store' });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return [null, new Error(`GET ${url}: ${err.message}`)];
  }

  if (!res.ok) return [null, new Error(`GET ${url}: HTTP ${res.status}`)];

  const body = (await res.json()) as T;
  return [body, null];
}

export function fetchStatus(): Promise<Result<StatusResponse>> {
  return getJson<StatusResponse>('/api/status');
}

export function fetchRooms(): Promise<Result<RoomsResponse>> {
  return getJson<RoomsResponse>('/api/rooms');
}

export function fetchSchedules(): Promise<Result<SchedulesResponse>> {
  return getJson<SchedulesResponse>('/api/schedules');
}

export function fetchEvents(): Promise<Result<EventsResponse>> {
  return getJson<EventsResponse>('/api/events');
}

export function fetchRoutines(): Promise<Result<RoutinesResponse>> {
  return getJson<RoutinesResponse>('/api/routines');
}
