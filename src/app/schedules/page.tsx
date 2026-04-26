import { fetchEvents, fetchRooms, fetchSchedules } from '@/lib/clyde';

import ScheduleManager from '../_components/ScheduleManager';
import { Header, PageLede, PageTitle } from '../_components/shared/Header';
import { BackLink } from '../_components/shared/NavLink';
import PageShell from '../_components/shared/PageShell';
import { ErrorBanner } from '../_components/shared/Section';

export default async function SchedulesPage() {
  const [schedulesData, schedulesErr] = await fetchSchedules();
  const [roomsData, roomsErr] = await fetchRooms();
  const [eventsData, eventsErr] = await fetchEvents();
  const loadError = schedulesErr ?? roomsErr ?? eventsErr;

  return (
    <PageShell>
      <Header>
        <BackLink href="/">← Home</BackLink>
        <PageTitle>Schedules</PageTitle>
        <PageLede>Triggers fire at the given local time on the days of the week you select.</PageLede>
      </Header>

      {loadError || !schedulesData || !roomsData || !eventsData ? (
        <ErrorBanner>
          Failed to load: {(loadError ?? new Error('unknown error')).message}
        </ErrorBanner>
      ) : (
        <ScheduleManager
          initialSchedules={schedulesData.schedules}
          rooms={roomsData.rooms.map(r => r.name)}
          events={eventsData.events.map(e => e.name)}
        />
      )}
    </PageShell>
  );
}
