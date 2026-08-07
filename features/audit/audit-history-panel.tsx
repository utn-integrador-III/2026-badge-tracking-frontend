import { Clock3, History } from 'lucide-react';
import { auditEvents, getAuditEventsForBadge } from './audit-history';

export function AuditHistoryPanel() {
  const events = getAuditEventsForBadge(auditEvents, 'badge_demo_001');

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#20398b]">
          <History className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-950">Historial de auditoria</h2>
          <p className="text-sm text-slate-600">Transacciones recientes de la credencial.</p>
        </div>
      </div>

      <ol className="mt-5 space-y-3">
        {events.map((event) => (
          <li key={event.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold capitalize text-slate-950">{event.type}</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock3 className="h-3.5 w-3.5" aria-hidden />
                {new Date(event.createdAt).toLocaleString('es-CR')}
              </span>
            </div>
            <p className="mt-1 text-slate-700">{event.details}</p>
            <p className="mt-1 text-xs text-slate-500">Actor: {event.actor}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
