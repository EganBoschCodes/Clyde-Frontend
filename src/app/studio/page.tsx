import { fetchRooms } from '@/lib/clyde';
import { roomLabel } from '@/lib/rooms/roomLabel';
import { sortRooms } from '@/lib/rooms/sortRooms';
import { fetchStudioRoutines } from '@/lib/studio/fetchStudioRoutines';

import PageHeader from '../_components/shared/PageHeader';
import PageShell from '../_components/shared/PageShell';
import { ErrorBanner } from '../_components/shared/Section';
import StudioManager from '../_components/StudioManager';

const LEDE = 'Design your own light routines: pick colors, choose how they move, try them live.';

export const dynamic = 'force-dynamic';

export default async function StudioPage() {
  const [routines, routinesErr] = await fetchStudioRoutines();
  const [roomsData, roomsErr] = await fetchRooms();
  const loadError = routinesErr ?? roomsErr;

  if (loadError || !routines || !roomsData) {
    return (
      <PageShell>
        <PageHeader title="Studio" lede={LEDE} />
        <ErrorBanner role="alert">Failed to load: {(loadError ?? new Error('unknown error')).message}</ErrorBanner>
      </PageShell>
    );
  }

  const rooms = sortRooms(roomsData.rooms).map(room => ({ name: room.name, label: roomLabel(room) }));

  return (
    <PageShell>
      <PageHeader title="Studio" lede={LEDE} />
      <StudioManager initialRoutines={routines} rooms={rooms} />
    </PageShell>
  );
}
