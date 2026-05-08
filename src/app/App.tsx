import {
  Activity,
  BadgeCheck,
  BookOpen,
  Brain,
  Coins,
  Download,
  Flame,
  Github,
  Heart,
  Mic,
  RotateCcw,
  Sparkles,
  Star,
  Upload,
  Volume2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { allExercises, lessons } from '../data/course';
import { runDuckDbSummary, type DuckDbSummary } from '../features/analytics/duckdbLab';
import { summarizeProgress } from '../features/analytics/progress';
import { generateDrills } from '../features/generation/generator';
import { checkChoiceExercise, checkTextExercise, type AnswerFeedback } from '../features/grammar/checker';
import { getDueCards, qualityFromScore, scheduleReview, type ReviewQuality } from '../features/review/srs';
import { useSpeechCapture } from '../features/speech/useSpeechCapture';
import { buildInfo } from '../lib/buildInfo';
import { exportState, parseImportedState } from '../lib/exportImport';
import { fetchMainCommit } from '../lib/github';
import { editSimilarity, normalizeAnswer } from '../lib/normalize';
import { createInitialState, loadState, resetState, saveState } from '../lib/storage';
import type { Exercise, LocalingoState, ReviewCard, SpeakExercise } from '../lib/types';

type Tab = 'lesson' | 'review' | 'generate' | 'progress';

const xpPerCorrect = 10;
const xpPerPartial = 4;

export function App() {
  const [state, setState] = useState<LocalingoState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Tab>('lesson');
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    void loadState().then((stored) => {
      setState(stored);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void saveState(state);
    }, 250);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [hydrated, state]);

  const summary = useMemo(() => summarizeProgress(state), [state]);
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const dueCards = useMemo(() => getDueCards(state.cards), [state.cards]);

  function recordAttempt(exercise: Exercise, response: string, feedback: AnswerFeedback) {
    const now = new Date();
    const quality = qualityFromScore(feedback.score);
    setState((current) => {
      const attempts = [
        ...current.attempts,
        {
          id: crypto.randomUUID(),
          exerciseId: exercise.id,
          lessonId: exercise.lessonId,
          at: now.toISOString(),
          correct: feedback.correct,
          score: feedback.score,
          response
        }
      ];
      const completedLessons = feedback.correct
        ? [...new Set([...current.profile.completedLessons, exercise.lessonId])]
        : current.profile.completedLessons;
      const xp =
        current.profile.xp + (feedback.correct ? xpPerCorrect : feedback.score >= 0.6 ? xpPerPartial : 0);
      const lastPracticeDate = now.toISOString().slice(0, 10);
      const streak = updateStreak(current.profile.lastPracticeDate, now, current.profile.streak);
      const cards = current.cards.map((card) =>
        card.id === exercise.cardId ? scheduleReview(card, quality, now) : card
      );
      return {
        ...current,
        profile: {
          ...current.profile,
          xp,
          streak,
          lastPracticeDate,
          completedLessons
        },
        cards,
        attempts
      };
    });
  }

  async function resetProgress() {
    const next = await resetState();
    setState(next);
    setTab('lesson');
  }

  function importProgress(file: File) {
    void file.text().then((content) => {
      const imported = parseImportedState(content);
      setState(imported);
    });
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-ink">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <StatsRail summary={summary} hydrated={hydrated} />
        <section className="min-w-0">
          <TabBar tab={tab} onTab={setTab} />
          {tab === 'lesson' && (
            <LessonWorkspace
              lessonId={selectedLesson.id}
              onLesson={setSelectedLessonId}
              onAttempt={recordAttempt}
              state={state}
            />
          )}
          {tab === 'review' && <ReviewWorkspace dueCards={dueCards} onReview={reviewCard} />}
          {tab === 'generate' && <GenerateWorkspace cards={state.cards} />}
          {tab === 'progress' && (
            <ProgressWorkspace
              state={state}
              onReset={resetProgress}
              onImport={importProgress}
              onExport={() => downloadText('localingo-progress.json', exportState(state))}
            />
          )}
        </section>
        <SidePanel
          state={state}
          selectedLessonId={selectedLesson.id}
          onLesson={setSelectedLessonId}
          dueCards={dueCards}
        />
      </main>
    </div>
  );

  function reviewCard(card: ReviewCard, quality: ReviewQuality) {
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        xp: current.profile.xp + (quality >= 3 ? 6 : 0),
        streak: updateStreak(current.profile.lastPracticeDate, new Date(), current.profile.streak),
        lastPracticeDate: new Date().toISOString().slice(0, 10)
      },
      cards: current.cards.map((item) => (item.id === card.id ? scheduleReview(item, quality) : item))
    }));
  }
}

function Header() {
  const commit = useQuery({
    queryKey: ['github-main-commit', buildInfo.repository],
    queryFn: () => fetchMainCommit(buildInfo.repository),
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  return (
    <header className="border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center bg-mint text-xl font-black text-white">Lo</div>
          <div>
            <h1 className="text-xl font-black tracking-normal">Localingo</h1>
            <p className="text-sm text-slate-600">Private language practice, stored in this browser.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <a className="toolbar-link" href={buildInfo.repositoryUrl} target="_blank" rel="noreferrer">
            <Github size={16} />
            Star on GitHub
          </a>
          <a className="toolbar-link" href={buildInfo.paypalUrl} target="_blank" rel="noreferrer">
            <Heart size={16} />
            PayPal
          </a>
          <a className="toolbar-link" href={buildInfo.pagesUrl} target="_blank" rel="noreferrer">
            <Star size={16} />
            Live
          </a>
          <div className="version-pill">
            v{buildInfo.version} ·{' '}
            {commit.data ? (
              <a href={commit.data.url} target="_blank" rel="noreferrer">
                {commit.data.shortSha}
              </a>
            ) : (
              buildInfo.buildCommit
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function StatsRail({
  summary,
  hydrated
}: {
  summary: ReturnType<typeof summarizeProgress>;
  hydrated: boolean;
}) {
  return (
    <aside className="grid gap-3 self-start md:grid-cols-2 lg:grid-cols-1">
      <Metric icon={<Flame />} label="Streak" value={`${summary.streak} days`} />
      <Metric icon={<Coins />} label="XP" value={hydrated ? `${summary.xp}` : '...'} />
      <Metric icon={<RotateCcw />} label="Due" value={`${summary.dueReviews}`} />
      <Metric icon={<BadgeCheck />} label="Accuracy" value={`${Math.round(summary.accuracy * 100)}%`} />
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

function TabBar({ tab, onTab }: { tab: Tab; onTab: (tab: Tab) => void }) {
  const tabs: Array<[Tab, string, React.ReactNode]> = [
    ['lesson', 'Lesson', <BookOpen key="lesson" size={16} />],
    ['review', 'Review', <RotateCcw key="review" size={16} />],
    ['generate', 'Generate', <Sparkles key="generate" size={16} />],
    ['progress', 'Progress', <Activity key="progress" size={16} />]
  ];
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="Workspace">
      {tabs.map(([key, label, icon]) => (
        <button
          className={`tab-button ${tab === key ? 'tab-button-active' : ''}`}
          key={key}
          onClick={() => onTab(key)}
          role="tab"
          aria-selected={tab === key}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}

function LessonWorkspace({
  lessonId,
  onLesson,
  onAttempt,
  state
}: {
  lessonId: string;
  onLesson: (lessonId: string) => void;
  onAttempt: (exercise: Exercise, response: string, feedback: AnswerFeedback) => void;
  state: LocalingoState;
}) {
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const exercise = lesson.exercises[exerciseIndex % lesson.exercises.length];
  const locked = state.profile.xp < lesson.unlockXp;

  useEffect(() => {
    setExerciseIndex(0);
  }, [lessonId]);

  return (
    <div className="workspace">
      <div className="flex flex-col gap-3 border-b border-black/10 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-slate-500">{lesson.title}</p>
          <h2 className="mt-1 text-3xl font-black">{exercise.prompt}</h2>
        </div>
        <select
          className="select"
          value={lessonId}
          onChange={(event) => onLesson(event.target.value)}
          aria-label="Select lesson"
        >
          {lessons.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} {state.profile.xp < item.unlockXp ? `(unlock ${item.unlockXp} XP)` : ''}
            </option>
          ))}
        </select>
      </div>
      {locked ? (
        <div className="p-6">
          <p className="text-lg font-semibold">
            Earn {lesson.unlockXp - state.profile.xp} more XP to unlock this set.
          </p>
        </div>
      ) : (
        <ExerciseCard
          exercise={exercise}
          onAttempt={(response, feedback) => {
            onAttempt(exercise, response, feedback);
          }}
          onNext={() => setExerciseIndex((index) => index + 1)}
        />
      )}
    </div>
  );
}

function ExerciseCard({
  exercise,
  onAttempt,
  onNext
}: {
  exercise: Exercise;
  onAttempt: (response: string, feedback: AnswerFeedback) => void;
  onNext: () => void;
}) {
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);

  useEffect(() => {
    setResponse('');
    setFeedback(null);
  }, [exercise.id]);

  function submit(value = response) {
    const nextFeedback =
      exercise.kind === 'choice'
        ? checkChoiceExercise(exercise, value)
        : exercise.kind === 'speak'
          ? {
              correct: editSimilarity(exercise.answer, value) > 0.8,
              score: editSimilarity(exercise.answer, value),
              title: 'Manual speech check',
              detail: exercise.explanation,
              suggestion: exercise.answer
            }
          : checkTextExercise(exercise, value);
    setFeedback(nextFeedback);
    onAttempt(value, nextFeedback);
  }

  return (
    <div className="p-5">
      {exercise.kind === 'choice' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {exercise.options.map((option) => (
            <button key={option} className="answer-button" onClick={() => submit(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
      {exercise.kind === 'type' && (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <input
            className="text-input"
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            placeholder={exercise.hint}
            autoComplete="off"
          />
          <button className="primary-button" type="submit">
            Check
          </button>
        </form>
      )}
      {exercise.kind === 'grammar' && (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div className="phrase-strip">{exercise.flawed}</div>
          <input
            className="text-input"
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            placeholder="Rewrite the phrase"
            autoComplete="off"
          />
          <button className="primary-button" type="submit">
            Check
          </button>
        </form>
      )}
      {exercise.kind === 'speak' && (
        <SpeakExercisePanel
          exercise={exercise}
          response={response}
          setResponse={setResponse}
          onManual={() => submit()}
          onScored={(score) => {
            const nextFeedback = {
              correct: score >= 0.68,
              score,
              title: score >= 0.68 ? 'Pronunciation pass' : 'Pronunciation practice',
              detail: exercise.explanation,
              suggestion: exercise.answer
            };
            setFeedback(nextFeedback);
            onAttempt(exercise.answer, nextFeedback);
          }}
        />
      )}
      {feedback && (
        <div className={`feedback ${feedback.correct ? 'feedback-good' : 'feedback-warn'}`}>
          <div>
            <p className="font-black">{feedback.title}</p>
            <p className="mt-1 text-sm">{feedback.detail}</p>
            <p className="mt-2 text-sm font-semibold">Answer: {feedback.suggestion}</p>
          </div>
          <button className="secondary-button" onClick={onNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function SpeakExercisePanel({
  exercise,
  response,
  setResponse,
  onManual,
  onScored
}: {
  exercise: SpeakExercise;
  response: string;
  setResponse: (value: string) => void;
  onManual: () => void;
  onScored: (score: number) => void;
}) {
  const capture = useSpeechCapture();
  const reportedScore = useRef<typeof capture.score>(null);

  useEffect(() => {
    if (capture.score && reportedScore.current !== capture.score) {
      reportedScore.current = capture.score;
      onScored(capture.score.score);
    }
  }, [capture.score, onScored]);

  return (
    <div className="grid gap-4">
      <div className="speech-panel">
        <div>
          <p className="text-sm font-bold uppercase text-slate-500">Target phrase</p>
          <p className="text-3xl font-black">{exercise.answer}</p>
          <p className="mt-1 text-slate-600">{exercise.phonetic}</p>
        </div>
        <button
          className={`mic-button ${capture.recording ? 'mic-button-recording' : ''}`}
          onClick={() => (capture.recording ? capture.stop() : void capture.start(exercise.targetHz))}
          aria-label={capture.recording ? 'Stop recording' : 'Start recording'}
        >
          <Mic />
        </button>
      </div>
      {capture.score && (
        <div className="grid gap-2 bg-white p-4">
          <p className="font-semibold">{capture.score.detail}</p>
          <div className="h-3 bg-slate-200">
            <div className="h-3 bg-mint" style={{ width: `${Math.round(capture.score.score * 100)}%` }} />
          </div>
          <p className="text-sm text-slate-600">
            {Math.round(capture.score.score * 100)}% · pitch {capture.score.pitchHz} Hz
          </p>
        </div>
      )}
      {capture.error && <p className="text-sm font-semibold text-red-700">{capture.error}</p>}
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          className="text-input"
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          placeholder="Type what you said"
          autoComplete="off"
        />
        <button className="secondary-button" onClick={onManual}>
          Manual check
        </button>
      </div>
    </div>
  );
}

function ReviewWorkspace({
  dueCards,
  onReview
}: {
  dueCards: ReviewCard[];
  onReview: (card: ReviewCard, quality: ReviewQuality) => void;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = dueCards[index % Math.max(dueCards.length, 1)];

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [dueCards.length]);

  if (!card) {
    return (
      <div className="workspace p-6">
        <h2 className="text-3xl font-black">Review queue clear</h2>
        <p className="mt-2 text-slate-600">New due cards will appear as your schedule matures.</p>
      </div>
    );
  }

  return (
    <div className="workspace p-6">
      <p className="text-sm font-bold uppercase text-slate-500">{dueCards.length} due now</p>
      <div className="my-6 grid min-h-64 place-items-center border border-black/10 bg-white p-6 text-center">
        <div>
          <p className="text-sm font-bold uppercase text-slate-500">Translate</p>
          <h2 className="mt-2 text-4xl font-black">{revealed ? card.back : card.front}</h2>
        </div>
      </div>
      {!revealed ? (
        <button className="primary-button w-full" onClick={() => setRevealed(true)}>
          Reveal
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            ['Again', 1],
            ['Hard', 3],
            ['Good', 4],
            ['Easy', 5]
          ].map(([label, quality]) => (
            <button
              key={label}
              className="answer-button"
              onClick={() => {
                onReview(card, quality as ReviewQuality);
                setRevealed(false);
                setIndex((value) => value + 1);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GenerateWorkspace({ cards }: { cards: ReviewCard[] }) {
  const drills = useMemo(() => generateDrills(cards, allExercises(), 4), [cards]);
  return (
    <div className="workspace p-6">
      <div className="flex items-center gap-3">
        <Brain className="text-coral" />
        <h2 className="text-3xl font-black">Generated set</h2>
      </div>
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

function ProgressWorkspace({
  state,
  onReset,
  onImport,
  onExport
}: {
  state: LocalingoState;
  onReset: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
}) {
  const [duck, setDuck] = useState<DuckDbSummary | null>(null);
  const [duckError, setDuckError] = useState<string | null>(null);
  const summary = summarizeProgress(state);

  return (
    <div className="workspace p-6">
      <h2 className="text-3xl font-black">Progress</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Metric icon={<Coins />} label="XP" value={`${summary.xp}`} />
        <Metric icon={<BadgeCheck />} label="Mature cards" value={`${summary.matureCards}`} />
        <Metric icon={<Activity />} label="Attempts" value={`${state.attempts.length}`} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <button className="secondary-button justify-center" onClick={onExport}>
          <Download size={16} />
          Export JSON
        </button>
        <label className="secondary-button cursor-pointer justify-center">
          <Upload size={16} />
          Import JSON
          <input
            className="sr-only"
            type="file"
            accept="application/json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImport(file);
            }}
          />
        </label>
      </div>
      <div className="mt-5 border border-black/10 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black">DuckDB-WASM lab</p>
            <p className="text-sm text-slate-600">Runs a local SQL summary in the browser.</p>
          </div>
          <button
            className="secondary-button"
            onClick={() => {
              setDuckError(null);
              void runDuckDbSummary(state.attempts)
                .then(setDuck)
                .catch((error: unknown) => {
                  setDuckError(error instanceof Error ? error.message : 'DuckDB failed to load.');
                });
            }}
          >
            Run SQL
          </button>
        </div>
        {duck && (
          <p className="mt-3 text-sm font-semibold">
            {duck.engine}: {duck.correct}/{duck.attempts} correct, {Math.round(duck.accuracy * 100)}% accuracy
          </p>
        )}
        {duckError && <p className="mt-3 text-sm font-semibold text-red-700">{duckError}</p>}
      </div>
      <button className="mt-5 text-sm font-bold text-red-700 underline" onClick={onReset}>
        Reset local progress
      </button>
    </div>
  );
}

function SidePanel({
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
                className={`lesson-node ${active ? 'lesson-node-active' : ''}`}
                key={lesson.id}
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
          <li>IndexedDB progress</li>
          <li>Web Audio speech score</li>
          <li>Local grammar rules</li>
          <li>n-gram embeddings</li>
          <li>DuckDB-WASM on demand</li>
        </ul>
      </section>
      <section className="panel p-4">
        <p className="text-sm font-bold uppercase text-slate-500">Next due</p>
        <p className="mt-1 text-3xl font-black">{dueCards.length}</p>
      </section>
    </aside>
  );
}

function updateStreak(lastPracticeDate: string | null, now: Date, currentStreak: number) {
  const today = now.toISOString().slice(0, 10);
  if (lastPracticeDate === today) return Math.max(1, currentStreak);
  if (!lastPracticeDate) return 1;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return lastPracticeDate === yesterday.toISOString().slice(0, 10) ? currentStreak + 1 : 1;
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
