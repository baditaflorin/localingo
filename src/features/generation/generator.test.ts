import { describe, expect, it } from 'vitest';
import { allExercises } from '../../data/course';
import type { ReviewCard } from '../../lib/types';
import { generateDrills } from './generator';

describe('generated drills', () => {
  it('creates deterministic drills from cards', () => {
    const cards: ReviewCard[] = [
      {
        id: 'card-hola',
        lessonId: 'basics-1',
        front: 'hello',
        back: 'hola',
        dueAt: '2026-05-08T00:00:00.000Z',
        intervalDays: 0,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 0
      }
    ];

    const drills = generateDrills(cards, allExercises(), 1);

    expect(drills).toHaveLength(1);
    expect(drills[0].answer).toBe('hola');
    expect(drills[0].options).toContain('hola');
  });
});
