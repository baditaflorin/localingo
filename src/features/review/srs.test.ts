import { describe, expect, it } from 'vitest';
import type { ReviewCard } from '../../lib/types';
import { getDueCards, qualityFromScore, scheduleReview } from './srs';

const baseCard: ReviewCard = {
  id: 'card-hola',
  lessonId: 'basics-1',
  front: 'hello',
  back: 'hola',
  dueAt: '2026-05-08T00:00:00.000Z',
  intervalDays: 0,
  easeFactor: 2.5,
  repetitions: 0,
  lapses: 0
};

describe('srs scheduler', () => {
  it('moves a successful card into the future', () => {
    const reviewed = scheduleReview(baseCard, 5, new Date('2026-05-08T10:00:00.000Z'));

    expect(reviewed.repetitions).toBe(1);
    expect(reviewed.intervalDays).toBe(1);
    expect(new Date(reviewed.dueAt).getTime()).toBeGreaterThan(
      new Date('2026-05-08T10:00:00.000Z').getTime()
    );
  });

  it('resets repetitions when the learner misses', () => {
    const mature = { ...baseCard, repetitions: 4, intervalDays: 12, lapses: 1 };
    const reviewed = scheduleReview(mature, 1, new Date('2026-05-08T10:00:00.000Z'));

    expect(reviewed.repetitions).toBe(0);
    expect(reviewed.lapses).toBe(2);
    expect(reviewed.intervalDays).toBe(1);
  });

  it('sorts due cards by due date', () => {
    const cards = [
      { ...baseCard, id: 'later', dueAt: '2026-05-08T08:00:00.000Z' },
      { ...baseCard, id: 'first', dueAt: '2026-05-07T08:00:00.000Z' }
    ];

    expect(getDueCards(cards, new Date('2026-05-08T09:00:00.000Z')).map((card) => card.id)).toEqual([
      'first',
      'later'
    ]);
  });

  it('maps answer scores to quality buckets', () => {
    expect(qualityFromScore(0.97)).toBe(5);
    expect(qualityFromScore(0.83)).toBe(4);
    expect(qualityFromScore(0.7)).toBe(3);
    expect(qualityFromScore(0.3)).toBe(1);
  });
});
