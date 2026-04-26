# Clyde-Frontend Documentation

Web frontend for Clyde, a local Home Assistant MCP + API server running on the Pi.

## Sections

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Backend Integration](#backend-integration)
- [Deployment](#deployment)
- [Additional Docs](#additional-docs)

---

## Overview

Clyde-Frontend serves the UI for controlling rooms, lights, routines, and schedules via Clyde's HTTP API. It is exposed at `theboschresidence.com` through a Cloudflare tunnel and proxies browser requests to the local Clyde backend so the backend stays off the public internet.

---

## Getting Started

Bun is required (Node is intentionally not installed on the Pi).

```bash
bun install
bun dev               # dev server on :3000
bun run build         # production build
bun run start         # production server
bun run lint          # eslint
bun x tsc --noEmit    # typecheck
```

---

## Architecture

Next.js 16 App Router with TypeScript, styled-components, and Tailwind v4 (`@tailwindcss/postcss`, no config file).

| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page with floorplan + room controls |
| `src/app/friends/` | Friends page |
| `src/app/schedules/` | Schedules page |
| `src/app/api/clyde/[...path]/route.ts` | Server-side proxy to Clyde backend |
| `src/app/_components/Floorplan/` | Interactive SVG floorplan |
| `src/app/_components/RoomControls/` | Light + media controls per room |
| `src/app/_components/ScheduleManager/` | Schedule CRUD UI |
| `src/app/_components/shared/` | Reusable UI primitives |
| `src/lib/clyde.ts` | Server-side Clyde API client |
| `src/lib/styledRegistry.tsx` | styled-components SSR registry |

---

## Backend Integration

Clyde runs at `http://localhost:8765` (started via `../Clyde/run`). Success responses return Pydantic models directly (e.g. `/api/status` → `{"status":"ready","service":"clyde"}`); errors return `{"error": "…"}` with a 4xx status.

| Caller | How to reach Clyde |
|--------|-------------------|
| Client components | `fetch('/api/clyde/<path>')` — hits the Next proxy |
| Server components / route handlers | Import from `@/lib/clyde`, calls `CLYDE_BACKEND_URL` directly |

`CLYDE_BACKEND_URL` is set in `.env.local` (defaults to `http://localhost:8765`). Template in `.env.example`. Never call `localhost:8765` from the browser — it is not on the tunnel.

---

## Deployment

- Backend: `../Clyde/run` on `:8765` (uvicorn).
- Frontend: `bun run build && bun run start` on `:3000`, managed by the `clyde-frontend.service` systemd unit.
- Public ingress: `cloudflared` tunnel `bosch-residence` routes `theboschresidence.com` → `localhost:3000`. Config in `cloudflared/config.yml`.
- Refresh after a deploy: `bun run build && systemctl restart clyde-frontend`.

---

## Additional Docs

| Document | Description |
|----------|-------------|
| [changelogs/](./changelogs/) | Version history and release notes |

---

*Last updated: v0.1.0*
