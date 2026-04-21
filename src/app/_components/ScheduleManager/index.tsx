'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ScheduledEvent } from '@/lib/clyde';

import { Button, Input, Select } from '../shared/Control';
import { List, ListRow, RowBody, RowMeta, RowTitle } from '../shared/List';
import { FaintText, Section, SectionHeading } from '../shared/Section';
import * as S from './styles';

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

  const renderScheduleRow = (s: ScheduledEvent) => {
    const key = scheduleKey(s);
    const rowError = deleteErrors[key];
    return (
      <ListRow key={key}>
        <RowBody>
          <RowTitle>{humanizeEvent(s.event)}</RowTitle>
          <RowMeta>
            {s.room}
            <span className="sep">·</span>
            {formatTime(s.time)}
          </RowMeta>
          {rowError ? <S.RowError>{rowError}</S.RowError> : null}
        </RowBody>
        <Button type="button" onClick={() => handleDelete(s)} disabled={deletingKey !== null}>
          {deletingKey === key ? 'Removing…' : 'Remove'}
        </Button>
      </ListRow>
    );
  };

  const canAdd = rooms.length > 0 && events.length > 0;
  const emptyMessage = rooms.length === 0 ? 'No rooms configured.' : 'No events available.';

  return (
    <S.Container>
      <Section>
        <SectionHeading>Existing</SectionHeading>
        {sorted.length === 0 ? (
          <FaintText>No schedules yet.</FaintText>
        ) : (
          <List>{sorted.map(renderScheduleRow)}</List>
        )}
      </Section>

      <Section>
        <SectionHeading>Add</SectionHeading>
        {!canAdd ? (
          <FaintText>{emptyMessage}</FaintText>
        ) : (
          <S.Form onSubmit={handleAdd}>
            <S.Field>
              Event
              <Select
                value={form.event}
                onChange={e => setForm(f => ({ ...f, event: e.target.value }))}
              >
                {events.map(ev => (
                  <option key={ev} value={ev}>
                    {humanizeEvent(ev)}
                  </option>
                ))}
              </Select>
            </S.Field>
            <S.Field>
              Room
              <Select
                value={form.room}
                onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
              >
                {rooms.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </S.Field>
            <S.Field>
              Time
              <Input
                type="time"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                required
              />
            </S.Field>
            <Button type="submit" disabled={adding}>
              {adding ? 'Adding…' : 'Add'}
            </Button>
            {addError ? <S.FormError>{addError}</S.FormError> : null}
          </S.Form>
        )}
      </Section>
    </S.Container>
  );
}
