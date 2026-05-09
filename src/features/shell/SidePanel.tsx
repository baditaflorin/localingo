import { Volume2 } from 'lucide-react';
import { lessons } from '../../data/course';
import type { LocalingoState, ReviewCard } from '../../lib/types';

export function SidePanel({
  state,
  selectedLessonId,
  onLesson,
  dueCards
}: {
  state: LocalingoState;
  selectedLessonId: string;
  onLesson: (lessonId: string) => void;
  dueCards: ReviewCard[];
}) {
  return (
    <aside className="grid gap-4 self-start">
      <section className="panel p-4">
        <p className="text-sm font-bold uppercase text-slate-500">Course map</p>
        <div className="mt-4 grid gap-3">
          {lessons.map((lesson) => {
            const locked = state.profile.xp < lesson.unlockXp;
            const active = lesson.id === selectedLessonId;
            return (
              <button
                key={lesson.id}
                className={`lesson-node ${active ? 'lesson-node-active' : ''}`}
                onClick={() => onLesson(lesson.id)}
                disabled={locked}
              >
                <span className="lesson-dot" style={{ backgroundColor: lesson.accent }} />
                <span>
                  <span className="block font-black">{lesson.title}</span>
                  <span className="block text-xs text-slate-500">
                    {locked ? `${lesson.unlockXp} XP` : lesson.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="panel p-4">
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-mint" />
          <p className="font-black">Local engines</p>
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700">
          <li>IndexedDB autosave and restore</li>
          <li>Web Audio pronunciation score</li>
          <li>Local grammar rules</li>
          <li>n-gram drill generation</li>
          <li>DuckDB-WASM on demand</li>
        </ul>
      </section>
      <section className="panel p-4">
        <p className="text-sm font-bold uppercase text-slate-500">Next due</p>
        <p className="mt-1 text-3xl font-black">{dueCards.length}</p>
      </section>
      <section className="panel p-4">
        <p className="text-sm font-bold uppercase text-slate-500">State movement</p>
        <p className="mt-2 text-sm text-slate-700">
          Use Progress to download, paste, drop, or share the full Localingo state.
        </p>
      </section>
    </aside>
  );
}
