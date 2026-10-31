import { fetchRooms } from '@/lib/clyde';
import { BLANK_SPEC } from '@/lib/studio/blankSpec';
import { copyName } from '@/lib/studio/copyName';
import { fetchStudioRoutines } from '@/lib/studio/fetchStudioRoutines';
import { roomLabel } from '@/lib/rooms/roomLabel';
import { sortRooms } from '@/lib/rooms/sortRooms';
import { findTemplate } from '@/lib/studio/templates';
import type { StudioRoutine, StudioSpec } from '@/lib/studio/types';

import PageHeader from '../../_components/shared/PageHeader';
import PageShell from '../../_components/shared/PageShell';
import { ErrorBanner } from '../../_components/shared/Section';
import StudioBackLink from '../../_components/StudioBackLink';
import StudioEditor from '../../_components/StudioEditor';

export const dynamic = 'force-dynamic';

interface NewStudioPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function pickInitial(templateId: string | null, from: StudioRoutine | null): StudioSpec {
  if (from) return { name: copyName(from.name), colors: from.colors, style: from.style, speed: from.speed, brightness: from.brightness };
  const template = templateId ? findTemplate(templateId) : null;
  return template ? template.spec : BLANK_SPEC;
}

export default async function NewStudioPage({ searchParams }: NewStudioPageProps) {
  const params = await searchParams;
  const [routines, routinesErr] = await fetchStudioRoutines();
  const [roomsData, roomsErr] = await fetchRooms();
  const loadError = routinesErr ?? roomsErr;

  if (loadError || !routines || !roomsData) {
    return (
      <PageShell>
        <StudioBackLink />
        <PageHeader title="New routine" />
        <ErrorBanner role="alert">Failed to load: {(loadError ?? new Error('unknown error')).message}</ErrorBanner>
      </PageShell>
    );
  }

  const fromKey = firstParam(params['from']);
  const from = routines.find(routine => routine.key === fromKey) ?? null;
  const initial = pickInitial(firstParam(params['template']), from);
  const rooms = sortRooms(roomsData.rooms).map(room => ({ name: room.name, label: roomLabel(room) }));

  return (
    <PageShell>
      <StudioBackLink />
      <PageHeader title="New routine" />
      <StudioEditor initial={initial} editingKey={null} existing={routines} rooms={rooms} />
    </PageShell>
  );
}
