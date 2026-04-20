import Link from 'next/link';

import { fetchEvents, fetchRooms, fetchSchedules } from '@/lib/clyde';

import ScheduleManager from '../_components/ScheduleManager';

export default async function SchedulesPage() {
  const [schedulesData, schedulesErr] = await fetchSchedules();
  const [roomsData, roomsErr] = await fetchRooms();
  const [eventsData, eventsErr] = await fetchEvents();
  const loadError = schedulesErr ?? roomsErr ?? eventsErr;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <main className="mx-auto max-w-3xl px-6 py-16 space-y-10">
        <header className="space-y-2">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ← Home
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight">Schedules</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Daily triggers fire once per day at the given local time.
          </p>
        </header>

        {loadError || !schedulesData || !roomsData || !eventsData ? (
          <p className="rounded border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            Failed to load: {(loadError ?? new Error('unknown error')).message}
          </p>
        ) : (
          <ScheduleManager
            initialSchedules={schedulesData.schedules}
            rooms={roomsData.rooms.map(r => r.name)}
            events={eventsData.events.map(e => e.name)}
          />
        )}
      </main>
    </div>
  );
}
