import { describe, expect, it } from 'vitest';
import { createInitialState } from '../../lib/storage';
import { summarizeProgress } from './progress';

describe('progress summary', () => {
  it('summarizes local state', () => {
    const state = createInitialState(new Date('2026-05-08T00:00:00.000Z'));
    state.profile.xp = 42;
    state.profile.streak = 3;
    state.attempts.push({
      id: 'attempt',
      exerciseId: 'exercise',
      lessonId: 'lesson',
      at: '2026-05-08T00:00:00.000Z',
      correct: true,
      score: 1,
      response: 'hola'
    });

    const summary = summarizeProgress(state, new Date('2026-05-08T00:00:00.000Z'));

    expect(summary.xp).toBe(42);
    expect(summary.streak).toBe(3);
    expect(summary.accuracy).toBe(1);
    expect(summary.dueReviews).toBeGreaterThan(0);
  });
});
