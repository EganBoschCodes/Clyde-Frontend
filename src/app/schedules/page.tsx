import { fetchEvents, fetchRooms, fetchSchedules } from '@/lib/clyde';
import { roomLabel } from '@/lib/rooms/roomLabel';
import { sortRooms } from '@/lib/rooms/sortRooms';

import ScheduleManager from '../_components/ScheduleManager';
import PageHeader from '../_components/shared/PageHeader';
import PageShell from '../_components/shared/PageShell';
import { ErrorBanner } from '../_components/shared/Section';

const LEDE = 'Triggers fire at the given local time on the days you select.';

export default async function SchedulesPage() {
  const [schedulesData, schedulesErr] = await fetchSchedules();
  const [roomsData, roomsErr] = await fetchRooms();
  const [eventsData, eventsErr] = await fetchEvents();
  const loadError = schedulesErr ?? roomsErr ?? eventsErr;

  if (loadError || !schedulesData || !roomsData || !eventsData) {
    return (
      <PageShell>
        <PageHeader title="Schedules" lede={LEDE} />
        <ErrorBanner>Failed to load: {(loadError ?? new Error('unknown error')).message}</ErrorBanner>
      </PageShell>
    );
  }

  const roomOptions = sortRooms(roomsData.rooms).map(r => ({ name: r.name, label: roomLabel(r) }));

  return (
    <PageShell>
      <PageHeader title="Schedules" lede={LEDE} />
      <ScheduleManager
        initialSchedules={schedulesData.schedules}
        rooms={roomOptions}
        events={eventsData.events.map(e => e.name)}
      />
    </PageShell>
  );
}
