'use client';

import { useEffect, useState } from 'react';

export function Countdown({ seconds }: Readonly<{ seconds: number }>) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <p className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white">Expira en {remaining}s</p>;
}
