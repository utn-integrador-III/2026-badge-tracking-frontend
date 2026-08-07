'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { firstRunTutorialSteps, getNextTutorialStep, isTutorialComplete } from '@/features/onboarding/tutorial';

const storageKey = 'digital-badge-first-run-tutorial-complete';

export function FirstRunTutorial() {
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const step = firstRunTutorialSteps[stepIndex];

  useEffect(() => {
    setVisible(localStorage.getItem(storageKey) !== 'true');
  }, []);

  const completeTutorial = () => {
    localStorage.setItem(storageKey, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className="mb-5 rounded-3xl border border-blue-100 bg-white p-5 shadow-xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#20398b]">
          <Sparkles className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#20398b]">Primer uso</p>
          <h2 className="text-lg font-bold text-slate-950">{step.title}</h2>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
      <p className="mt-3 text-xs font-semibold text-slate-500">
        Paso {stepIndex + 1} de {firstRunTutorialSteps.length}
      </p>

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={completeTutorial} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
          Saltar
        </button>
        <button
          type="button"
          onClick={() => {
            if (isTutorialComplete(stepIndex)) completeTutorial();
            else setStepIndex((current) => getNextTutorialStep(current));
          }}
          className="flex-1 rounded-xl bg-[#20398b] px-4 py-2 text-sm font-semibold text-white"
        >
          {isTutorialComplete(stepIndex) ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </section>
  );
}
