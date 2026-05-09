import { describe, expect, it } from 'vitest';
import { createInitialState } from './storage';
import { exportState, exportStateJson, parseImportedState } from './exportImport';
import { createShareHash, parseSharedHash } from './share';

describe('export/import', () => {
  it('round-trips a valid state export', () => {
    const state = createInitialState(new Date('2026-05-08T00:00:00.000Z'));
    const parsed = parseImportedState(exportStateJson(state));

    expect(exportState(state).schemaVersion).toBe(2);
    expect(parsed.schemaVersion).toBe(2);
    expect(parsed.cards.length).toBe(state.cards.length);
  });

  it('rejects invalid imports', () => {
    expect(() => parseImportedState('{"schemaVersion":2}')).toThrow();
  });

  it('upgrades a v1 state into the v2 schema', () => {
    const v1State = JSON.stringify({
      schemaVersion: 1,
      profile: {
        name: 'Legacy learner',
        xp: 12,
        streak: 2,
        lastPracticeDate: null,
        totalMinutes: 0,
        completedLessons: []
      },
      cards: [],
      attempts: [],
      settings: {
        dailyGoalXp: 20,
        voiceEnabled: false
      }
    });

    const parsed = parseImportedState(v1State);

    expect(parsed.schemaVersion).toBe(2);
    expect(parsed.settings.showRomanizedHints).toBe(true);
    expect(parsed.activityLog[0].kind).toBe('import');
  });

  it('round-trips a share hash', () => {
    const state = createInitialState(new Date('2026-05-08T00:00:00.000Z'));
    const hash = createShareHash(state);
    const parsed = parseSharedHash(hash);

    expect(parsed).not.toBeNull();
    expect(parsed?.schemaVersion).toBe(2);
    expect(parsed?.cards.length).toBe(state.cards.length);
  });
});
