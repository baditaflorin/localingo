import { describe, expect, it } from 'vitest';
import { allExercises, courseVersion, findLesson, lessons } from './course';

describe('course catalogue', () => {
  it('ships a deeper Spanish course (at least eight lessons)', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(8);
    expect(courseVersion).toMatch(/^es-quickstart-/);
  });

  it('uses unique lesson and exercise ids', () => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id));
    expect(lessonIds.size).toBe(lessons.length);
    const exerciseIds = allExercises().map((exercise) => exercise.id);
    expect(new Set(exerciseIds).size).toBe(exerciseIds.length);
  });

  it('keeps every lesson balanced across the four exercise kinds', () => {
    for (const lesson of lessons) {
      const kinds = new Set(lesson.exercises.map((exercise) => exercise.kind));
      expect(kinds.has('choice')).toBe(true);
      expect(kinds.has('type')).toBe(true);
      expect(kinds.has('speak')).toBe(true);
      expect(kinds.has('grammar')).toBe(true);
    }
  });

  it('unlocks lessons in a monotonically increasing XP order', () => {
    const xpThresholds = lessons.map((lesson) => lesson.unlockXp);
    for (let index = 1; index < xpThresholds.length; index += 1) {
      expect(xpThresholds[index]).toBeGreaterThan(xpThresholds[index - 1] ?? -1);
    }
  });

  it('exposes every exercise via the lesson lookup', () => {
    for (const lesson of lessons) {
      expect(findLesson(lesson.id)).toBe(lesson);
      for (const exercise of lesson.exercises) {
        expect(exercise.lessonId).toBe(lesson.id);
      }
    }
  });
});
