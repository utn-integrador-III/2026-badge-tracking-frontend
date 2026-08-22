import { BellRing, CalendarClock } from 'lucide-react';
import type { DigitalBadge } from '@/types/badge';
import { getExpiryNotification } from '@/features/notifications/expiry-notifications';

const levelStyles = {
  safe: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  expired: 'border-red-200 bg-red-50 text-red-900'
};

export function ExpiryNotificationCard({ badge }: Readonly<{ badge: DigitalBadge }>) {
  const notification = getExpiryNotification(badge);

  return (
    <section className={`rounded-2xl border p-4 shadow-sm ${levelStyles[notification.level]}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70">
          <BellRing className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-bold">{notification.title}</h2>
          <p className="text-sm opacity-80">Fecha limite: {notification.renewBy}</p>
        </div>
      </div>
      <p className="mt-3 flex items-start gap-2 text-sm leading-6">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {notification.message}
      </p>
    </section>
  );
}
