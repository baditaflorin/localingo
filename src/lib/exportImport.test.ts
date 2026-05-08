import { describe, expect, it } from 'vitest';
import { createInitialState } from './storage';
import { exportState, parseImportedState } from './exportImport';

describe('export/import', () => {
  it('round-trips a valid state export', () => {
    const state = createInitialState(new Date('2026-05-08T00:00:00.000Z'));
    const parsed = parseImportedState(exportState(state));

    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.cards.length).toBe(state.cards.length);
  });

  it('rejects invalid imports', () => {
    expect(() => parseImportedState('{"schemaVersion":2}')).toThrow();
  });
});
