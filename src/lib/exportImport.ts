import { z } from 'zod';
import type { LocalingoState } from './types';

const stateSchemaV2 = z.object({
  schemaVersion: z.literal(2),
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
    voiceEnabled: z.boolean(),
    showRomanizedHints: z.boolean(),
    confirmDestructiveActions: z.boolean()
  }),
  activityLog: z.array(
    z.object({
      id: z.string(),
      at: z.string(),
      kind: z.enum([
        'lesson',
        'review',
        'import',
        'export',
        'share',
        'settings',
        'reset',
        'analytics',
        'system'
      ]),
      message: z.string()
    })
  )
});

const stateSchemaV1 = z.object({
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

const exportEnvelopeV2 = z.object({
  kind: z.literal('localingo-state'),
  schemaVersion: z.literal(2),
  appVersion: z.string(),
  exportedAt: z.string(),
  state: stateSchemaV2
});

export type LocalingoExport = z.infer<typeof exportEnvelopeV2>;

export function exportState(state: LocalingoState): LocalingoExport {
  return {
    kind: 'localingo-state',
    schemaVersion: 2,
    appVersion: __APP_VERSION__,
    exportedAt: new Date().toISOString(),
    state
  };
}

export function exportStateJson(state: LocalingoState) {
  return JSON.stringify(exportState(state), null, 2);
}

export function parseImportedState(value: string): LocalingoState {
  const parsed = JSON.parse(value) as unknown;

  const envelopeResult = exportEnvelopeV2.safeParse(parsed);
  if (envelopeResult.success) {
    return envelopeResult.data.state;
  }

  const v2Result = stateSchemaV2.safeParse(parsed);
  if (v2Result.success) {
    return v2Result.data;
  }

  const v1Result = stateSchemaV1.safeParse(parsed);
  if (v1Result.success) {
    return {
      schemaVersion: 2,
      profile: v1Result.data.profile,
      cards: v1Result.data.cards,
      attempts: v1Result.data.attempts,
      settings: {
        dailyGoalXp: v1Result.data.settings.dailyGoalXp,
        voiceEnabled: v1Result.data.settings.voiceEnabled,
        showRomanizedHints: true,
        confirmDestructiveActions: true
      },
      activityLog: [
        {
          id: `import-${Date.now()}`,
          at: new Date().toISOString(),
          kind: 'import',
          message: 'Imported and upgraded a v1 Localingo state'
        }
      ]
    };
  }

  throw new Error('This file is not a valid Localingo export.');
}
