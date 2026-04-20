import { fetchRooms, fetchStatus } from '@/lib/clyde';
import RoomControls from './_components/RoomControls';

export default async function Home() {
  const [status, statusErr] = await fetchStatus();
  const [rooms, roomsErr] = await fetchRooms();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <main className="mx-auto max-w-3xl px-6 py-16 space-y-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">The Bosch Residence</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Clyde frontend — Home Assistant control surface.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-sm uppercase tracking-wider text-zinc-500">Backend</h2>
          {statusErr ? (
            <p className="rounded border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              Clyde unreachable: {statusErr.message}
            </p>
          ) : (
            <p className="text-sm">
              <span className="font-mono">{status.service}</span>{' '}
              <span className="text-zinc-500">·</span>{' '}
              <span className="font-mono">{status.status}</span>
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-zinc-500">Rooms</h2>
          {roomsErr ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load rooms: {roomsErr.message}
            </p>
          ) : rooms.rooms.length === 0 ? (
            <p className="text-sm text-zinc-500">No rooms configured.</p>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded border border-zinc-200 dark:border-zinc-800">
              {rooms.rooms.map(room => (
                <li key={room.name} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <div className="font-medium">{room.name}</div>
                    <div className="text-xs text-zinc-500">
                      {room.lights.length} light{room.lights.length === 1 ? '' : 's'}
                      <span className="mx-1">·</span>
                      {room.active_routine ?? 'idle'}
                    </div>
                  </div>
                  <RoomControls room={room.name} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
