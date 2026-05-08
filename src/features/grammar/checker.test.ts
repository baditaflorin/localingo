import { describe, expect, it } from 'vitest';
import type { GrammarExercise, TypeExercise } from '../../lib/types';
import { checkTextExercise, grammarHintsFor } from './checker';

const typeExercise: TypeExercise = {
  id: 'type',
  lessonId: 'lesson',
  cardId: 'card',
  kind: 'type',
  prompt: 'thank you',
  answer: 'gracias',
  accepted: ['gracias', 'muchas gracias'],
  hint: 'gra',
  explanation: 'Use gracias.'
};

const grammarExercise: GrammarExercise = {
  id: 'grammar',
  lessonId: 'lesson',
  cardId: 'card',
  kind: 'grammar',
  prompt: 'Fix',
  flawed: 'yo quiero aprender manana espanol',
  answer: 'quiero aprender espanol manana',
  rule: 'Move manana.',
  explanation: 'Keep the action together.'
};

describe('grammar checker', () => {
  it('accepts exact and accent-insensitive answers', () => {
    expect(checkTextExercise(typeExercise, 'Muchas gracias!').correct).toBe(true);
  });

  it('returns near-miss feedback with a suggestion', () => {
    const feedback = checkTextExercise(typeExercise, 'gracia');

    expect(feedback.correct).toBe(false);
    expect(feedback.score).toBeGreaterThan(0.7);
    expect(feedback.suggestion).toBe('gracias');
  });

  it('detects grammar hints for optional pronouns and time placement', () => {
    const hints = grammarHintsFor(grammarExercise.answer, 'yo quiero aprender manana espanol');

    expect(hints.join(' ')).toContain('drops yo');
    expect(hints.join(' ')).toContain('manana');
  });
});
