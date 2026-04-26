import { fetchRooms, fetchRoutines } from '@/lib/clyde';

import PageShell from './_components/shared/PageShell';
import Floorplan from './_components/Floorplan';
import RoomControls from './_components/RoomControls';
import {
  List,
  ListRow,
  RowBody,
  RowMeta,
  RowTitle,
} from './_components/shared/List';
import {
  Header,
  Nav,
  PageTitle,
} from './_components/shared/Header';
import { NavLink } from './_components/shared/NavLink';
import {
  ErrorText,
  FaintText,
  Section,
  SectionHeading,
} from './_components/shared/Section';

export default async function Home() {
  const [rooms, roomsErr] = await fetchRooms();
  const [routinesData] = await fetchRoutines();
  const routineNames = routinesData?.routines.map(r => r.name) ?? [];

  return (
    <PageShell>
      <Header>
        <PageTitle>The Bosch Residence</PageTitle>
        <Nav>
          <NavLink href="/schedules">Schedules</NavLink>
          <NavLink href="/friends">Party</NavLink>
        </Nav>
      </Header>

      <Section>
        <SectionHeading>Rooms</SectionHeading>
        {roomsErr ? (
          <ErrorText>Failed to load rooms: {roomsErr.message}</ErrorText>
        ) : rooms.rooms.length === 0 ? (
          <FaintText>No rooms configured.</FaintText>
        ) : (
          <List>
            {rooms.rooms.map(room => (
              <ListRow key={room.name}>
                <RowBody>
                  <RowTitle>{room.name}</RowTitle>
                  <RowMeta>
                    {room.lights.length} light{room.lights.length === 1 ? '' : 's'}
                    <span className="sep">·</span>
                    {room.active_routine ?? 'idle'}
                  </RowMeta>
                </RowBody>
                <RoomControls
                  room={room.name}
                  routines={routineNames}
                  activeRoutine={room.active_routine}
                  dimFactor={room.dim_factor}
                />
              </ListRow>
            ))}
          </List>
        )}
      </Section>

      {!roomsErr && rooms.rooms.length > 0 ? (
        <Section>
          <SectionHeading>Floorplan</SectionHeading>
          <Floorplan lights={rooms.rooms.flatMap(r => r.lights)} />
        </Section>
      ) : null}
    </PageShell>
  );
}
