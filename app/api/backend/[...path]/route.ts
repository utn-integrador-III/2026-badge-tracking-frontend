import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const upstreamBaseUrl = (process.env.BACKEND_API_BASE_URL ?? '').replace(/\/$/, '');

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRequest(request: NextRequest, context: RouteContext) {
  if (!upstreamBaseUrl) {
    return NextResponse.json({ detail: 'BACKEND_API_BASE_URL is not configured' }, { status: 503 });
  }

  const { path } = await context.params;
  const upstreamUrl = new URL(`${upstreamBaseUrl}/${path.map(encodeURIComponent).join('/')}`);
  upstreamUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const accept = request.headers.get('accept');
  const contentType = request.headers.get('content-type');
  const authorization = request.headers.get('authorization');
  if (accept) headers.set('accept', accept);
  if (contentType) headers.set('content-type', contentType);
  if (authorization) headers.set('authorization', authorization);

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: 'no-store'
    });
  } catch {
    return NextResponse.json({ detail: 'Backend service is unavailable' }, { status: 502 });
  }

  const responseHeaders = new Headers();
  const upstreamContentType = upstreamResponse.headers.get('content-type');
  const cacheControl = upstreamResponse.headers.get('cache-control');
  if (upstreamContentType) responseHeaders.set('content-type', upstreamContentType);
  if (cacheControl) responseHeaders.set('cache-control', cacheControl);

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
