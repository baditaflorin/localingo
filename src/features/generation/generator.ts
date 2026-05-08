import type { Exercise, ReviewCard } from '../../lib/types';
import { semanticSimilarity } from './embeddings';

export interface GeneratedDrill {
  id: string;
  prompt: string;
  answer: string;
  options: string[];
  reason: string;
}

const distractors = ['hola', 'gracias', 'agua', 'derecha', 'quiero', 'aprendo', 'hoy', 'donde'];

export function generateDrills(cards: ReviewCard[], seedExercises: Exercise[], limit = 3): GeneratedDrill[] {
  const dueFirst = [...cards].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  return dueFirst.slice(0, limit).map((card, index) => {
    const related = seedExercises
      .map((exercise) => ({
        exercise,
        score: semanticSimilarity(`${exercise.prompt} ${exercise.answer}`, `${card.front} ${card.back}`)
      }))
      .sort((a, b) => b.score - a.score)[0]?.exercise;
    const options = uniqueShuffle([card.back, ...distractors.filter((item) => item !== card.back)]).slice(
      0,
      4
    );

    return {
      id: `generated-${card.id}-${index}`,
      prompt: `Translate: ${card.front}`,
      answer: card.back,
      options,
      reason: related ? `Reinforces ${related.prompt}` : 'Reinforces a due review card'
    };
  });
}

function uniqueShuffle(values: string[]) {
  return [...new Set(values)].sort((a, b) => stableNoise(a) - stableNoise(b));
}

function stableNoise(value: string) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0) % 17;
}
