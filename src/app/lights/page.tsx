import { fetchLightOutput, fetchLights, fetchRooms, fetchRoutines, type LightInfo, type LightState, type RoomStatus } from '@/lib/clyde';
import { roomLabel } from '@/lib/rooms/roomLabel';
import { sortRooms } from '@/lib/rooms/sortRooms';

import LightsRoomSection from '../_components/LightsRoomSection';
import type { RoomLight } from '../_components/LightsRoomSection';
import PageHeader from '../_components/shared/PageHeader';
import PageShell from '../_components/shared/PageShell';
import { ErrorBanner, FaintText } from '../_components/shared/Section';

const LEDE = 'Control one light at a time.';
const OTHER_LABEL = 'Other';

export const dynamic = 'force-dynamic';

function lightsForRoom(room: RoomStatus, byName: Map<string, LightInfo>, states: Map<string, LightState>): RoomLight[] {
  const lights: RoomLight[] = [];
  for (const name of room.lights) {
    const info = byName.get(name);
    if (!info) continue;
    lights.push({ name, pin: info.pin, state: states.get(name) ?? null });
  }
  return lights;
}

export default async function LightsPage() {
  const [[lightsData, lightsErr], [roomsData, roomsErr], [routinesData]] = await Promise.all([
    fetchLights(),
    fetchRooms(),
    fetchRoutines(),
  ]);
  const loadError = lightsErr ?? roomsErr;

  if (loadError || !lightsData || !roomsData) {
    return (
      <PageShell isWide>
        <PageHeader title="Lights" lede={LEDE} />
        <ErrorBanner role="alert">Failed to load: {(loadError ?? new Error('unknown error')).message}</ErrorBanner>
      </PageShell>
    );
  }

  const outputs = await Promise.all(lightsData.lights.map(light => fetchLightOutput(light.name)));
  const states = new Map<string, LightState>();
  for (const [output] of outputs) {
    if (output) states.set(output.light, output.state);
  }
  const routines = routinesData?.routines ?? [];
  const byName = new Map(lightsData.lights.map(light => [light.name, light]));
  const rooms = sortRooms(roomsData.rooms);
  const roomed = new Set(rooms.flatMap(room => room.lights));
  const unassigned = lightsData.lights.filter(light => !roomed.has(light.name));

  if (byName.size === 0) {
    return (
      <PageShell isWide>
        <PageHeader title="Lights" lede={LEDE} />
        <FaintText>No lights configured.</FaintText>
      </PageShell>
    );
  }

  const renderRoom = (room: RoomStatus) => {
    const lights = lightsForRoom(room, byName, states);
    if (lights.length === 0) return null;
    return (
      <LightsRoomSection
        key={room.name}
        room={room.name}
        label={roomLabel(room)}
        lights={lights}
        routines={routines}
        activeRoutine={room.active_routine}
      />
    );
  };

  return (
    <PageShell isWide>
      <PageHeader title="Lights" lede={LEDE} />
      {rooms.map(renderRoom)}
      {unassigned.length > 0 ? (
        <LightsRoomSection
          room={null}
          label={OTHER_LABEL}
          lights={unassigned.map(light => ({ name: light.name, pin: light.pin, state: states.get(light.name) ?? null }))}
          routines={routines}
          activeRoutine={null}
        />
      ) : null}
    </PageShell>
  );
}
