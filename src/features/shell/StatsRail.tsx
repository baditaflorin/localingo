import { BadgeCheck, Coins, Flame, Goal, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { goalProgress } from '../../app/useLocalingoApp';
import { summarizeProgress } from '../analytics/progress';
import type { LocalingoState } from '../../lib/types';

export function StatsRail({ state, hydrated }: { state: LocalingoState; hydrated: boolean }) {
  const summary = summarizeProgress(state);
  const goal = goalProgress(state);

  return (
    <aside className="grid gap-3 self-start md:grid-cols-2 lg:grid-cols-1">
      <Metric label="Streak" value={`${summary.streak} days`} icon={<Flame />} />
      <Metric label="XP" value={hydrated ? `${summary.xp}` : '...'} icon={<Coins />} />
      <Metric label="Due" value={`${summary.dueReviews}`} icon={<RotateCcw />} />
      <Metric label="Accuracy" value={`${Math.round(summary.accuracy * 100)}%`} icon={<BadgeCheck />} />
      <div className="panel p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center bg-skyglass text-mint">
            <Goal />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-slate-500">Daily Goal</p>
            <p className="text-xl font-black">
              {goal.current}/{goal.target} XP
            </p>
          </div>
        </div>
        <div className="mt-3 h-3 bg-slate-200">
          <div className="h-3 bg-mint" style={{ width: `${Math.round(goal.ratio * 100)}%` }} />
        </div>
      </div>
    </aside>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="panel flex items-center gap-3 p-4">
      <div className="grid h-10 w-10 place-items-center bg-skyglass text-mint">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
    </div>
  );
}
