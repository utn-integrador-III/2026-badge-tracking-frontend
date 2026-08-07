import Image from 'next/image';
import { BadgeInfo, Code2, ShieldCheck, Smartphone } from 'lucide-react';
import { formatVersionLabel, getSupportItems, versionInfo } from '@/lib/about/version-info';

export default function AboutPage() {
  const supportItems = getSupportItems();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] pb-28 shadow-2xl">
      <header className="bg-[#20398b] px-5 pb-8 pt-5 text-center text-white">
        <Image src="/brand/logo.png" alt="Logo de la UTN" width={56} height={56} className="mx-auto rounded-xl bg-white p-1" priority />
        <h1 className="mt-4 text-2xl font-bold">Acerca de Digital Badge</h1>
        <p className="mt-2 text-sm text-white/75">Información de versión, equipo y capacidades de la aplicación.</p>
      </header>

      <section className="space-y-5 p-5">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#20398b]">
              <BadgeInfo className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Versión</p>
              <h2 className="font-bold text-slate-950">{formatVersionLabel()}</h2>
            </div>
          </div>

          <dl className="mt-5 divide-y divide-slate-100 text-sm">
            <div className="grid grid-cols-3 gap-3 py-3">
              <dt className="text-slate-500">Canal</dt>
              <dd className="col-span-2 font-semibold capitalize text-slate-950">{versionInfo.buildChannel}</dd>
            </div>
            <div className="grid grid-cols-3 gap-3 py-3">
              <dt className="text-slate-500">Release</dt>
              <dd className="col-span-2 font-semibold text-slate-950">{versionInfo.release}</dd>
            </div>
            <div className="grid grid-cols-3 gap-3 py-3">
              <dt className="text-slate-500">Repositorio</dt>
              <dd className="col-span-2 break-words font-semibold text-slate-950">{versionInfo.repository}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-slate-950">
            <ShieldCheck className="h-5 w-5 text-[#20398b]" aria-hidden />
            Capacidades principales
          </div>
          <ul className="mt-4 space-y-3">
            {supportItems.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-slate-950">
            <Smartphone className="h-5 w-5 text-[#20398b]" aria-hidden />
            Badge Tracking Project
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Aplicación PWA para administrar, verificar y compartir credenciales digitales institucionales de la Universidad Técnica Nacional.
          </p>
          <p className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
            <Code2 className="h-4 w-4" aria-hidden />
            Frontend · Next.js · PWA
          </p>
        </article>
      </section>
    </main>
  );
}
