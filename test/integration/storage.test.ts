import { describe, expect, it } from 'vitest';
import { createInitialState } from '../../src/lib/storage';

describe('integration placeholder', () => {
  it('creates a usable initial state', () => {
    const state = createInitialState();
    expect(state.cards.length).toBeGreaterThan(0);
  });
});
