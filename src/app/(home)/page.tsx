import { fetchRooms, fetchRoutines } from '@/lib/clyde';
import { roomLabel } from '@/lib/rooms/roomLabel';
import { sortRooms } from '@/lib/rooms/sortRooms';

import Floorplan from '../_components/Floorplan';
import HomeHeader from '../_components/HomeHeader';
import RoomCard from '../_components/RoomCard';
import PageShell from '../_components/shared/PageShell';
import { ErrorText, FaintText, Section, SectionHeading } from '../_components/shared/Section';
import * as S from './styles';

export default async function Home() {
  const [[rooms, roomsErr], [routinesData]] = await Promise.all([fetchRooms(), fetchRoutines()]);
  const routines = routinesData?.routines ?? [];

  if (roomsErr) {
    return (
      <PageShell>
        <HomeHeader rooms={[]} />
        <ErrorText>Failed to load rooms: {roomsErr.message}</ErrorText>
      </PageShell>
    );
  }

  const sortedRooms = sortRooms(rooms.rooms);

  if (sortedRooms.length === 0) {
    return (
      <PageShell>
        <HomeHeader rooms={[]} />
        <FaintText>No rooms configured.</FaintText>
      </PageShell>
    );
  }

  const renderRoom = (room: (typeof sortedRooms)[number]) => (
    <RoomCard
      key={room.name}
      room={room.name}
      label={roomLabel(room)}
      lights={room.lights}
      routines={routines}
      activeRoutine={room.active_routine}
      activeEvent={room.active_event ?? null}
      dimFactor={room.dim_factor}
    />
  );

  return (
    <PageShell isWide>
      <HomeHeader rooms={sortedRooms.map(r => r.name)} />
      <S.RoomGrid>{sortedRooms.map(renderRoom)}</S.RoomGrid>
      <Section>
        <SectionHeading>Floorplan</SectionHeading>
        <Floorplan rooms={sortedRooms.map(r => ({ name: r.name, lights: r.lights }))} />
      </Section>
    </PageShell>
  );
}
