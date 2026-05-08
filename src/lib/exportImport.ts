import { z } from 'zod';
import type { LocalingoState } from './types';

const stateSchema = z.object({
  schemaVersion: z.literal(1),
  profile: z.object({
    name: z.string(),
    xp: z.number(),
    streak: z.number(),
    lastPracticeDate: z.string().nullable(),
    totalMinutes: z.number(),
    completedLessons: z.array(z.string())
  }),
  cards: z.array(
    z.object({
      id: z.string(),
      lessonId: z.string(),
      front: z.string(),
      back: z.string(),
      dueAt: z.string(),
      intervalDays: z.number(),
      easeFactor: z.number(),
      repetitions: z.number(),
      lapses: z.number()
    })
  ),
  attempts: z.array(
    z.object({
      id: z.string(),
      exerciseId: z.string(),
      lessonId: z.string(),
      at: z.string(),
      correct: z.boolean(),
      score: z.number(),
      response: z.string()
    })
  ),
  settings: z.object({
    dailyGoalXp: z.number(),
    voiceEnabled: z.boolean()
  })
});

export function exportState(state: LocalingoState) {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function parseImportedState(value: string): LocalingoState {
  const parsed = JSON.parse(value) as unknown;
  return stateSchema.parse(parsed);
}
