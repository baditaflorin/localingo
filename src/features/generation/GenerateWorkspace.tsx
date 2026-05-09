import { Brain } from 'lucide-react';
import { useMemo } from 'react';
import { allExercises } from '../../data/course';
import { generateDrills } from './generator';
import { normalizeAnswer } from '../../lib/normalize';
import type { ReviewCard } from '../../lib/types';

export function GenerateWorkspace({ cards }: { cards: ReviewCard[] }) {
  const drills = useMemo(() => generateDrills(cards, allExercises(), 4), [cards]);

  return (
    <div className="workspace p-6">
      <div className="flex items-center gap-3">
        <Brain className="text-coral" />
        <h2 className="text-3xl font-black">Generated set</h2>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Localingo builds these from your due review cards, so the first guess is already useful.
      </p>
      <div className="mt-5 grid gap-3">
        {drills.map((drill) => (
          <div className="border border-black/10 bg-white p-4" key={drill.id}>
            <p className="text-sm font-bold uppercase text-slate-500">{drill.reason}</p>
            <p className="mt-1 text-xl font-black">{drill.prompt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {drill.options.map((option) => (
                <span
                  className={normalizeAnswer(option) === normalizeAnswer(drill.answer) ? 'chip-good' : 'chip'}
                  key={option}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
