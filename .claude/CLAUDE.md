<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Clyde-Frontend

Web frontend for Clyde, our local Home Assistant MCP + API server. Runs on the
Pi and is exposed at `theboschresidence.com` via a Cloudflare tunnel.

## Scope

- UI for controlling rooms, lights, and routines via Clyde's HTTP API.
- Server-side proxy at `/api/clyde/*` → `localhost:8765/api/*` so the browser
  stays same-origin and Clyde stays off the public tunnel.

## Non-scope

- MCP tool logic, routine engine, or HA wrapping — those live in sibling
  `../Clyde/` and `../Home-Assistant-Lib/`.
- HA container + configuration — lives in sibling `../Home-Assistant-Deployment/`.

## Stack

- **Bun** (not Node): `bun install`, `bun dev`, `bun run build`, `bun run start`.
  Node is intentionally not installed on the Pi — always use Bun.
- **Next.js 16** with App Router, TypeScript, Tailwind v4, ESLint, `src/` dir.
  Next 16 has breaking changes from earlier versions — read the matching doc
  under `node_modules/next/dist/docs/` before using a Next API you're unsure
  about (route handlers, `PageProps`, `RouteContext`, typed routes, caching).
- **Tailwind v4** via `@tailwindcss/postcss`; no `tailwind.config.ts`.

## Backend integration

Clyde runs at `http://localhost:8765` (started via `../Clyde/run`). Response
shape for success is the Pydantic model directly (e.g. `/api/status` returns
`{"status":"ready","service":"clyde"}`); errors return `{"error": "…"}` with a
4xx status.

- **Client code**: fetch `/api/clyde/<path>` — hits the Next proxy at
  `src/app/api/clyde/[...path]/route.ts`.
- **Server components / route handlers**: import from `@/lib/clyde` and call
  the backend directly via `CLYDE_BACKEND_URL`.
- **Never** hit `localhost:8765` from the browser; it's not on the tunnel.

`CLYDE_BACKEND_URL` is set in `.env.local` (defaults to
`http://localhost:8765` if unset). Template in `.env.example`.

## TypeScript conventions

The `write-typescript` skill defines our patterns — error tuples, guard
clauses, no `any`, colocated single-use types, one primary function per file.
The `.claude/` hooks gate `.ts` / `.tsx` edits on invoking that skill and run
`bun x tsc --noEmit` after edits to feed errors back. Follow the skill's
conventions unless a Next.js API makes that awkward.

## Commands

```bash
bun install           # install deps
bun dev               # dev server on :3000
bun run build         # production build
bun run start         # production server
bun run lint          # eslint
bun x tsc --noEmit    # typecheck
```

## Deployment

- Clyde backend: `../Clyde/run` on `:8765` (uvicorn).
- Frontend: `bun run build && bun run start` on `:3000`.
- Public ingress: `cloudflared` tunnel `bosch-residence` routes
  `theboschresidence.com` → `localhost:3000`. Config in `cloudflared/config.yml`.
