# v0.1.2

UI cleanup pass on the home page and snappier room controls — off switches and routine changes apply visually without waiting on the backend round trip.

## Sections

- [Highlights](#highlights)
- [Features](#features)
- [Technical Details](#technical-details)
- [Commits](#commits)

---

## Highlights

- Turning a room off now updates the floorplan lamps instantly instead of waiting for the next poll.
- Room controls stay interactive while a routine or dim change is in flight — no more disabled selects, sliders, or "Applying…" status text.
- Home page trimmed: backend status block, page lede, and redundant copy removed.

---

## Features

| Area | Details |
|------|---------|
| Floorplan | Subscribes to `room_state` events; when a room reports no active routine, every mapped lamp in that room snaps to off and any in-flight transition animation is dropped |
| Room controls | Routine `<select>` and dim slider are no longer disabled while a request is pending; the inline "Applying {routine}…" status line was removed |
| Home page | Removed the **Backend** section (Clyde status line and unreachable banner) and the page lede; nav and rooms are now the first things on screen |

---

## Technical Details

### Realtime
- `RealtimeProvider` now exposes `subscribeRoomState(cb)` alongside `subscribeLightOn`, returning an unsubscribe function. Subscribers fire on every `room_state` event, in addition to the existing `roomState` map update.
- `Floorplan` props changed from `lights: string[]` to `rooms: { name; lights }[]` so the component can map an incoming `room_state` event back to the lamps it owns. `lights` and a `room → lights` lookup are derived via `useMemo`.
- On a `room_state` event with `active_routine === null`, the floorplan deletes any pending lamp animation and writes `OFF_RENDERED` directly into the rendered snapshot.

### Room controls
- Removed `disabled` from the routine `<select>` and the dim `<input type="range">`.
- Removed the `Status` styled component and the `pending === 'routine'` status line.

### Home page
- Dropped `fetchStatus` call and the `StatusLine` / `Mono` / `Sep` / `ErrorBanner` / `PageLede` imports from `src/app/page.tsx`.

---

## Commits

- `c59fa61` — Cleaning up the front page
- `eb28014` — Off switches change lights instantly
- `d177fa8` — Removing unnecessary text
- `065ab4c` — UI Cleanup

---

*Last updated: v0.1.2 — 2026-04-26*
