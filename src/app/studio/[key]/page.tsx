import { fetchRooms } from '@/lib/clyde';
import { roomLabel } from '@/lib/rooms/roomLabel';
import { sortRooms } from '@/lib/rooms/sortRooms';
import { fetchStudioRoutines } from '@/lib/studio/fetchStudioRoutines';

import PageHeader from '../../_components/shared/PageHeader';
import PageShell from '../../_components/shared/PageShell';
import { ErrorBanner } from '../../_components/shared/Section';
import StudioBackLink from '../../_components/StudioBackLink';
import StudioEditor from '../../_components/StudioEditor';

export const dynamic = 'force-dynamic';

interface EditStudioPageProps {
  params: Promise<{ key: string }>;
}

export default async function EditStudioPage({ params }: EditStudioPageProps) {
  const { key } = await params;
  const routineKey = decodeURIComponent(key);
  const [routines, routinesErr] = await fetchStudioRoutines();
  const [roomsData, roomsErr] = await fetchRooms();
  const loadError = routinesErr ?? roomsErr;

  if (loadError || !routines || !roomsData) {
    return (
      <PageShell>
        <StudioBackLink />
        <PageHeader title="Edit routine" />
        <ErrorBanner role="alert">Failed to load: {(loadError ?? new Error('unknown error')).message}</ErrorBanner>
      </PageShell>
    );
  }

  const routine = routines.find(r => r.key === routineKey);
  if (!routine) {
    return (
      <PageShell>
        <StudioBackLink />
        <PageHeader title="Routine not found" lede="It may have been deleted." />
      </PageShell>
    );
  }

  const rooms = sortRooms(roomsData.rooms).map(room => ({ name: room.name, label: roomLabel(room) }));
  const spec = { name: routine.name, colors: routine.colors, style: routine.style, speed: routine.speed, brightness: routine.brightness };

  return (
    <PageShell>
      <StudioBackLink />
      <PageHeader title="Edit routine" />
      <StudioEditor key={routine.key} initial={spec} editingKey={routine.key} existing={routines} rooms={rooms} />
    </PageShell>
  );
}
