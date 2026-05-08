import { describe, expect, it } from 'vitest';
import { semanticSimilarity } from './embeddings';

describe('local embeddings', () => {
  it('scores close phrases above unrelated phrases', () => {
    const close = semanticSimilarity('where is the bathroom', 'where bathroom');
    const far = semanticSimilarity('where is the bathroom', 'thank you coffee');

    expect(close).toBeGreaterThan(far);
  });
});
