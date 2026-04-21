import { fetchRooms, fetchRoutines, fetchStatus } from '@/lib/clyde';

import PageShell from './_components/shared/PageShell';
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
  PageLede,
  PageTitle,
} from './_components/shared/Header';
import { NavLink } from './_components/shared/NavLink';
import {
  ErrorBanner,
  ErrorText,
  FaintText,
  Section,
  SectionHeading,
} from './_components/shared/Section';
import { Mono, Sep, StatusLine } from './_components/HomePageStyles';

export default async function Home() {
  const [status, statusErr] = await fetchStatus();
  const [rooms, roomsErr] = await fetchRooms();
  const [routinesData] = await fetchRoutines();
  const routineNames = routinesData?.routines.map(r => r.name) ?? [];

  return (
    <PageShell>
      <Header>
        <PageTitle>The Bosch Residence</PageTitle>
        <PageLede>Clyde frontend — Home Assistant control surface.</PageLede>
        <Nav>
          <NavLink href="/schedules">Schedules</NavLink>
        </Nav>
      </Header>

      <Section>
        <SectionHeading>Backend</SectionHeading>
        {statusErr ? (
          <ErrorBanner>Clyde unreachable: {statusErr.message}</ErrorBanner>
        ) : (
          <StatusLine>
            <Mono>{status.service}</Mono>
            <Sep>·</Sep>
            <Mono>{status.status}</Mono>
          </StatusLine>
        )}
      </Section>

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
    </PageShell>
  );
}
