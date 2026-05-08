import type { Exercise, GrammarExercise, TypeExercise } from '../../lib/types';
import { editSimilarity, normalizeAnswer, tokenize } from '../../lib/normalize';

export interface AnswerFeedback {
  correct: boolean;
  score: number;
  title: string;
  detail: string;
  suggestion: string;
}

export function checkTextExercise(
  exercise: TypeExercise | GrammarExercise,
  response: string
): AnswerFeedback {
  const normalized = normalizeAnswer(response);
  const accepted =
    exercise.kind === 'type'
      ? exercise.accepted.map((answer) => normalizeAnswer(answer))
      : [normalizeAnswer(exercise.answer)];
  const exact = accepted.includes(normalized);
  const bestSimilarity = Math.max(...accepted.map((answer) => editSimilarity(answer, normalized)));
  const grammarHints = grammarHintsFor(exercise.answer, response);
  const correct = exact || bestSimilarity >= 0.92;

  if (correct) {
    return {
      correct: true,
      score: 1,
      title: 'Clean answer',
      detail: exercise.explanation,
      suggestion: exercise.answer
    };
  }

  if (bestSimilarity >= 0.72) {
    return {
      correct: false,
      score: bestSimilarity,
      title: 'Almost there',
      detail: grammarHints[0] ?? 'The meaning is close, but the phrase needs a small correction.',
      suggestion: exercise.answer
    };
  }

  return {
    correct: false,
    score: bestSimilarity,
    title: 'Needs review',
    detail: grammarHints[0] ?? exercise.explanation,
    suggestion: exercise.answer
  };
}

export function checkChoiceExercise(exercise: Exercise, response: string): AnswerFeedback {
  const correct = normalizeAnswer(exercise.answer) === normalizeAnswer(response);
  return {
    correct,
    score: correct ? 1 : 0,
    title: correct ? 'Correct' : 'Review this one',
    detail: exercise.explanation,
    suggestion: exercise.answer
  };
}

export function grammarHintsFor(expected: string, response: string) {
  const expectedTokens = tokenize(expected);
  const responseTokens = tokenize(response);
  const hints: string[] = [];

  if (responseTokens.includes('yo') && !expectedTokens.includes('yo')) {
    hints.push('Spanish often drops yo when the verb already identifies the speaker.');
  }
  if (responseTokens.includes('el') && !expectedTokens.includes('el')) {
    hints.push('The article el is not needed in this phrase.');
  }
  if (responseTokens.includes('la') && !expectedTokens.includes('la')) {
    hints.push('The article la is not needed in this phrase.');
  }
  if (
    responseTokens.includes('manana') &&
    expectedTokens.at(-1) === 'manana' &&
    responseTokens.at(-1) !== 'manana'
  ) {
    hints.push('Put manana at the end to keep the action phrase together.');
  }
  if (expectedTokens.length > 1 && responseTokens.length > 1 && expectedTokens[0] !== responseTokens[0]) {
    hints.push(`Start with "${expectedTokens[0]}" for the most natural order.`);
  }

  return hints;
}
