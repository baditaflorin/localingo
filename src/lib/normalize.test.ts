import { describe, expect, it } from 'vitest';
import { editSimilarity, normalizeAnswer, tokenize } from './normalize';

describe('normalization', () => {
  it('normalizes accents, punctuation, and whitespace', () => {
    expect(normalizeAnswer('  ¿Dónde   está? ')).toBe('donde esta');
    expect(tokenize('Muchas gracias!')).toEqual(['muchas', 'gracias']);
  });

  it('scores edit similarity', () => {
    expect(editSimilarity('gracias', 'gracia')).toBeGreaterThan(0.8);
    expect(editSimilarity('gracias', 'derecha')).toBeLessThan(0.5);
  });
});
