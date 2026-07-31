'use client';

import { useEffect, useRef, useState } from 'react';

type CountdownProps = Readonly<{
  expiresAt: string;
  onExpire: () => void;
}>;

export function getRemainingSeconds(expiresAt: string, now = Date.now()) {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000));
}

export function Countdown({ expiresAt, onExpire }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(expiresAt));
  const expirationHandled = useRef(false);

  useEffect(() => {
    expirationHandled.current = false;

    const updateRemaining = () => {
      const nextRemaining = getRemainingSeconds(expiresAt);
      setRemaining(nextRemaining);

      if (nextRemaining === 0 && !expirationHandled.current) {
        expirationHandled.current = true;
        onExpire();
      }
    };

    updateRemaining();
    const interval = window.setInterval(updateRemaining, 250);

    return () => window.clearInterval(interval);
  }, [expiresAt, onExpire]);

  return (
    <p aria-live="polite" role="timer" className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white">
      Expira en {remaining}s
    </p>
  );
}
