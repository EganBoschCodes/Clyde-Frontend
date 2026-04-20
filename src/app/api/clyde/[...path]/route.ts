import type { NextRequest } from 'next/server';

const DEFAULT_CLYDE_URL = 'http://localhost:8765';
const BODYLESS_METHODS = new Set(['GET', 'HEAD']);
const HOP_BY_HOP_HEADERS = ['connection', 'host', 'content-length'];

type Result<T, E = Error> = [T, null] | [null, E];

type RouteCtx = { params: Promise<{ path: string[] }> };

async function safeFetch(url: string, init: RequestInit): Promise<Result<Response>> {
  try {
    return [await fetch(url, init), null];
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }
}

function buildUpstreamUrl(req: NextRequest, path: string[]): string {
  const base = process.env['CLYDE_BACKEND_URL'] ?? DEFAULT_CLYDE_URL;
  const search = new URL(req.url).search;
  return `${base}/api/${path.join('/')}${search}`;
}

function buildUpstreamHeaders(req: NextRequest): Headers {
  const headers = new Headers(req.headers);
  for (const name of HOP_BY_HOP_HEADERS) headers.delete(name);
  return headers;
}

async function proxy(req: NextRequest, ctx: RouteCtx): Promise<Response> {
  const { path } = await ctx.params;
  const url = buildUpstreamUrl(req, path);

  const init: RequestInit = {
    method: req.method,
    headers: buildUpstreamHeaders(req),
    body: BODYLESS_METHODS.has(req.method) ? undefined : await req.arrayBuffer(),
  };

  const [res, err] = await safeFetch(url, init);
  if (err) {
    return Response.json(
      { error: `clyde backend unreachable: ${err.message}`, upstream: url },
      { status: 502 },
    );
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
