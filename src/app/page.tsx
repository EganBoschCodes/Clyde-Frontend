import { fetchRooms, fetchRoutines } from '@/lib/clyde';
import { roomLabel } from '@/lib/rooms/roomLabel';
import { sortRooms } from '@/lib/rooms/sortRooms';

import Floorplan from './_components/Floorplan';
import RoomCard from './_components/RoomCard';
import PageHeader from './_components/shared/PageHeader';
import PageShell from './_components/shared/PageShell';
import { ErrorText, FaintText, Section, SectionHeading } from './_components/shared/Section';
import * as S from './styles';

export default async function Home() {
  const [rooms, roomsErr] = await fetchRooms();
  const [routinesData] = await fetchRoutines();
  const routineNames = routinesData?.routines.map(r => r.name) ?? [];

  if (roomsErr) {
    return (
      <PageShell>
        <PageHeader title="Home" lede="The Bosch Residence" />
        <ErrorText>Failed to load rooms: {roomsErr.message}</ErrorText>
      </PageShell>
    );
  }

  const sortedRooms = sortRooms(rooms.rooms);

  if (sortedRooms.length === 0) {
    return (
      <PageShell>
        <PageHeader title="Home" lede="The Bosch Residence" />
        <FaintText>No rooms configured.</FaintText>
      </PageShell>
    );
  }

  const renderRoom = (room: (typeof sortedRooms)[number]) => (
    <RoomCard
      key={room.name}
      room={room.name}
      label={roomLabel(room)}
      lightCount={room.lights.length}
      routines={routineNames}
      activeRoutine={room.active_routine}
      dimFactor={room.dim_factor}
    />
  );

  return (
    <PageShell isWide>
      <PageHeader title="Home" lede="The Bosch Residence" />
      <S.HomeGrid>
        <Section>
          <SectionHeading>Rooms</SectionHeading>
          <S.RoomStack>{sortedRooms.map(renderRoom)}</S.RoomStack>
        </Section>
        <S.Aside>
          <SectionHeading>Floorplan</SectionHeading>
          <Floorplan rooms={sortedRooms.map(r => ({ name: r.name, lights: r.lights }))} />
        </S.Aside>
      </S.HomeGrid>
    </PageShell>
  );
}
