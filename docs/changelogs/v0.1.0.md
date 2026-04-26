# v0.1.0

Initial release of the Clyde-Frontend — the Pi-hosted web UI for the Clyde Home Assistant API.

## Sections

- [Highlights](#highlights)
- [Features](#features)
- [Infrastructure](#infrastructure)
- [Stack](#stack)

---

## Highlights

- Next.js 16 App Router frontend wired to the Clyde backend at `localhost:8765`.
- Same-origin proxy keeps the backend off the public Cloudflare tunnel.
- Interactive floorplan + per-room controls for lights, media, and routines.

---

## Features

| Area | Details |
|------|---------|
| Home page | SVG floorplan with clickable rooms, surfaces room controls inline |
| Room controls | On/off toggles, dimmer sliders, media player transport |
| Schedules page | Create, list, and remove schedules via the Clyde API |
| Friends page | Standalone page for friend-related controls |
| Shared UI | Reusable `Header`, `NavLink`, `PageShell`, `Section`, `List`, `Control` primitives |

---

## Infrastructure

- `src/app/api/clyde/[...path]/route.ts` proxies browser requests to `http://localhost:8765/api/*`.
- `src/lib/clyde.ts` provides a server-side client driven by `CLYDE_BACKEND_URL` (default `http://localhost:8765`).
- `src/lib/styledRegistry.tsx` enables styled-components SSR under the App Router.
- `cloudflared` tunnel `bosch-residence` routes `theboschresidence.com` → `localhost:3000`.
- Frontend runs under the `clyde-frontend.service` systemd unit (`bun run start`).

---

## Stack

| Dependency | Version |
|------------|---------|
| Next.js | 16.2.4 |
| React | 19.2.4 |
| styled-components | ^6.4.0 |
| TypeScript | ^5 |
| Tailwind | v4 (via `@tailwindcss/postcss`) |
| Runtime | Bun (Node not installed on the Pi) |

---

*Last updated: v0.1.0*
