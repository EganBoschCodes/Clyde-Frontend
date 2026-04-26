# v0.1.1

Real-time light animation, day-of-week scheduling, and a Party nav entry.

## Sections

- [Highlights](#highlights)
- [Features](#features)
- [Technical Details](#technical-details)
- [Commits](#commits)

---

## Highlights

- Floorplan lamps now animate color and brightness transitions in real time via a new `light_on` websocket event.
- Schedules can be restricted to specific days of the week, with shortcuts for **Every day**, **Weekdays**, and **Weekends**.
- Home nav links to the existing `/friends` page as **Party**.

---

## Features

| Area | Details |
|------|---------|
| Floorplan | Subscribes to backend `light_on` events and tweens lamp color, brightness, and on/off state per the event's `transition` duration; polling remains as a fallback at 5 s (was 3 s) |
| Schedules — form | New day-of-week toggle row (Mon–Sun); empty selection blocks submit with an inline error |
| Schedules — list | Each row shows the schedule's days, collapsed to "Every day" / "Weekdays" / "Weekends" where applicable |
| Schedules — copy | Page lede updated to reflect day-of-week selection |
| Home nav | Added `Party` → `/friends` alongside `Schedules` |

---

## Technical Details

### Realtime
- `LightOnEvent` added to `src/lib/realtime/messages.ts` with `room`, `light`, `rgb_color`, `brightness`, and `transition` fields.
- `RealtimeProvider` exposes `subscribeLightOn(cb)` returning an unsubscribe function; the provider value is now memoized.
- `Floorplan` keeps a `RenderedLight` snapshot per lamp and runs a `requestAnimationFrame` loop that lerps between `from` / `to` states. Polling writes are skipped while an animation is in flight to avoid clobbering interpolated state.

### Schedules
- `ScheduledEvent` in `src/lib/clyde.ts` gained a required `days_of_week: number[]` field (0 = Mon … 6 = Sun) — paired with the matching backend change.
- `ScheduleManager` form gained `FieldsGrid`, `DaysField`, `DaysRow`, `DayToggle`, and `Actions` styled primitives; the existing fields were regrouped into a grid and the action buttons moved into a dedicated row (Test, then Add).

### Cleanup
- Removed stray `floorplan.svg` and `image.png` from the repo root.

---

## Commits

- `c01cf78` — Real time web events for light transitions
- `0fe1f31` — Improved scheduling UI
- `f88955d` — New friends link

---

*Last updated: v0.1.1 — 2026-04-25*
