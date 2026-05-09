import { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import { lessons } from '../../data/course';
import { checkChoiceExercise, checkTextExercise, type AnswerFeedback } from '../grammar/checker';
import { useSpeechCapture } from '../speech/useSpeechCapture';
import { editSimilarity } from '../../lib/normalize';
import type { Exercise, LocalingoState, SpeakExercise } from '../../lib/types';

export function LessonWorkspace({
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
          settings={state.settings}
          onAttempt={(response, feedback) => onAttempt(exercise, response, feedback)}
          onNext={() => setExerciseIndex((index) => index + 1)}
        />
      )}
    </div>
  );
}

function ExerciseCard({
  exercise,
  onAttempt,
  onNext,
  settings
}: {
  exercise: Exercise;
  onAttempt: (response: string, feedback: AnswerFeedback) => void;
  onNext: () => void;
  settings: LocalingoState['settings'];
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
          voiceEnabled={settings.voiceEnabled}
          showRomanizedHints={settings.showRomanizedHints}
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
  onScored,
  voiceEnabled,
  showRomanizedHints
}: {
  exercise: SpeakExercise;
  response: string;
  setResponse: (value: string) => void;
  onManual: () => void;
  onScored: (score: number) => void;
  voiceEnabled: boolean;
  showRomanizedHints: boolean;
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
          {showRomanizedHints && <p className="mt-1 text-slate-600">{exercise.phonetic}</p>}
        </div>
        <button
          className={`mic-button ${capture.recording ? 'mic-button-recording' : ''}`}
          onClick={() => (capture.recording ? capture.stop() : void capture.start(exercise.targetHz))}
          aria-label={capture.recording ? 'Stop recording' : 'Start recording'}
          disabled={!voiceEnabled}
          title={!voiceEnabled ? 'Enable voice practice in Settings to record pronunciation.' : undefined}
        >
          <Mic />
        </button>
      </div>
      {!voiceEnabled && (
        <p className="text-sm font-semibold text-slate-600">
          Voice practice is off. Turn it back on in Settings or use Manual check for this exercise.
        </p>
      )}
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
