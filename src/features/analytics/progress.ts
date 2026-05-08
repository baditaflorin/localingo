import type { LocalingoState, ReviewCard } from '../../lib/types';
import { getDueCards } from '../review/srs';

export interface ProgressSummary {
  xp: number;
  streak: number;
  dueReviews: number;
  accuracy: number;
  completedLessons: number;
  matureCards: number;
}

export function summarizeProgress(state: LocalingoState, at = new Date()): ProgressSummary {
  const attempts = state.attempts;
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return {
    xp: state.profile.xp,
    streak: state.profile.streak,
    dueReviews: getDueCards(state.cards, at).length,
    accuracy: attempts.length > 0 ? correct / attempts.length : 0,
    completedLessons: state.profile.completedLessons.length,
    matureCards: countMatureCards(state.cards)
  };
}

export function countMatureCards(cards: ReviewCard[]) {
  return cards.filter((card) => card.intervalDays >= 7 && card.repetitions >= 3).length;
}
