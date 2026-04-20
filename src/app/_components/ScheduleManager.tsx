'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ScheduledEvent } from '@/lib/clyde';

const INPUT_CLS =
  'rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm';
const BTN_CLS =
  'rounded border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50';

interface ScheduleManagerProps {
  initialSchedules: ScheduledEvent[];
  rooms: string[];
  events: string[];
}

interface FormState {
  event: string;
  room: string;
  time: string;
}

async function parseErrorBody(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? `HTTP ${res.status}`;
}

async function createSchedule(payload: ScheduledEvent): Promise<Error | null> {
  let res: Response;
  try {
    res = await fetch('/api/clyde/schedules', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    return e instanceof Error ? e : new Error(String(e));
  }
  if (res.ok) return null;
  return new Error(await parseErrorBody(res));
}

async function removeSchedule(payload: ScheduledEvent): Promise<Error | null> {
  const qs = new URLSearchParams({
    event: payload.event,
    room: payload.room,
    time: payload.time,
  }).toString();
  let res: Response;
  try {
    res = await fetch(`/api/clyde/schedules?${qs}`, { method: 'DELETE' });
  } catch (e) {
    return e instanceof Error ? e : new Error(String(e));
  }
  if (res.ok) return null;
  return new Error(await parseErrorBody(res));
}

function scheduleKey(s: ScheduledEvent): string {
  return `${s.event}|${s.room}|${s.time}`;
}

function humanizeEvent(name: string): string {
  return name.replace(/_/g, ' ');
}

function formatTime(t: string): string {
  const [hhRaw, mmRaw] = t.split(':');
  const hour = Number(hhRaw);
  const minute = mmRaw ?? '00';
  if (Number.isNaN(hour)) return t;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute} ${period}`;
}

function sortSchedules(schedules: ScheduledEvent[]): ScheduledEvent[] {
  return [...schedules].sort((a, b) => {
    if (a.time !== b.time) return a.time.localeCompare(b.time);
    if (a.room !== b.room) return a.room.localeCompare(b.room);
    return a.event.localeCompare(b.event);
  });
}

export default function ScheduleManager({
  initialSchedules,
  rooms,
  events,
}: ScheduleManagerProps) {
  const router = useRouter();
  const defaultRoom = rooms[0] ?? '';
  const defaultEvent = events[0] ?? '';
  const [form, setForm] = useState<FormState>({
    event: defaultEvent,
    room: defaultRoom,
    time: '07:00',
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [deleteErrors, setDeleteErrors] = useState<Record<string, string>>({});

  const sorted = sortSchedules(initialSchedules);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.room) return;

    setAdding(true);
    setAddError(null);

    const err = await createSchedule({ ...form });
    setAdding(false);
    if (err) {
      setAddError(err.message);
      return;
    }
    router.refresh();
  };

  const handleDelete = async (sched: ScheduledEvent) => {
    const key = scheduleKey(sched);
    setDeletingKey(key);
    setDeleteErrors(prev => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

    const err = await removeSchedule(sched);
    setDeletingKey(null);
    if (err) {
      setDeleteErrors(prev => ({ ...prev, [key]: err.message }));
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-zinc-500">Existing</h2>
        {sorted.length === 0 ? (
          <p className="text-sm text-zinc-500">No schedules yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded border border-zinc-200 dark:border-zinc-800">
            {sorted.map(s => {
              const key = scheduleKey(s);
              const rowError = deleteErrors[key];
              return (
                <li key={key} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <div className="font-medium">{humanizeEvent(s.event)}</div>
                    <div className="text-xs text-zinc-500">
                      {s.room}
                      <span className="mx-1">·</span>
                      {formatTime(s.time)}
                    </div>
                    {rowError ? <p className="mt-1 text-xs text-red-500">{rowError}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(s)}
                    disabled={deletingKey !== null}
                    className={BTN_CLS}
                  >
                    {deletingKey === key ? 'Removing…' : 'Remove'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-zinc-500">Add</h2>
        {rooms.length === 0 || events.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {rooms.length === 0 ? 'No rooms configured.' : 'No events available.'}
          </p>
        ) : (
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs text-zinc-500">
              Event
              <select
                value={form.event}
                onChange={e => setForm(f => ({ ...f, event: e.target.value }))}
                className={INPUT_CLS}
              >
                {events.map(ev => (
                  <option key={ev} value={ev}>
                    {humanizeEvent(ev)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-500">
              Room
              <select
                value={form.room}
                onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                className={INPUT_CLS}
              >
                {rooms.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-500">
              Time
              <input
                type="time"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                required
                className={INPUT_CLS}
              />
            </label>
            <button type="submit" disabled={adding} className={BTN_CLS}>
              {adding ? 'Adding…' : 'Add'}
            </button>
            {addError ? <p className="w-full text-xs text-red-500">{addError}</p> : null}
          </form>
        )}
      </section>
    </div>
  );
}
