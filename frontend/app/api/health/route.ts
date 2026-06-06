export function GET() {
  return Response.json({ ok: true, service: 'digital-badge-pwa', timestamp: new Date().toISOString() });
}
