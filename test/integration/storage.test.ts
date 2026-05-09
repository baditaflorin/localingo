import { describe, expect, it } from 'vitest';
import { createInitialState } from '../../src/lib/storage';

describe('storage integration', () => {
  it('creates a usable initial state', () => {
    const state = createInitialState();
    expect(state.cards.length).toBeGreaterThan(0);
    expect(state.schemaVersion).toBe(2);
    expect(state.settings.showRomanizedHints).toBe(true);
    expect(state.activityLog.length).toBeGreaterThan(0);
  });
});
