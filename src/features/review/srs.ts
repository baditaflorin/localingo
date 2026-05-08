import type { ReviewCard } from '../../lib/types';

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

const dayMs = 24 * 60 * 60 * 1000;

export function scheduleReview(
  card: ReviewCard,
  quality: ReviewQuality,
  reviewedAt = new Date()
): ReviewCard {
  const failed = quality < 3;
  const easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  let repetitions = failed ? 0 : card.repetitions + 1;
  let intervalDays = 1;

  if (failed) {
    repetitions = 0;
    intervalDays = 1;
  } else if (repetitions === 1) {
    intervalDays = 1;
  } else if (repetitions === 2) {
    intervalDays = 3;
  } else {
    const qualityBoost = quality === 5 ? 1.25 : quality === 4 ? 1 : 0.75;
    intervalDays = Math.max(1, Math.round(card.intervalDays * easeFactor * qualityBoost));
  }

  return {
    ...card,
    easeFactor,
    repetitions,
    lapses: failed ? card.lapses + 1 : card.lapses,
    intervalDays,
    dueAt: new Date(reviewedAt.getTime() + intervalDays * dayMs).toISOString()
  };
}

export function getDueCards(cards: ReviewCard[], at = new Date()) {
  const now = at.getTime();
  return cards
    .filter((card) => new Date(card.dueAt).getTime() <= now)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export function qualityFromScore(score: number): ReviewQuality {
  if (score >= 0.96) return 5;
  if (score >= 0.82) return 4;
  if (score >= 0.68) return 3;
  if (score >= 0.4) return 2;
  return 1;
}
