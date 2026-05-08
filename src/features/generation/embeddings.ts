import { normalizeAnswer } from '../../lib/normalize';

export type Embedding = Map<string, number>;

export function embedText(value: string, ngramSize = 3): Embedding {
  const normalized = `  ${normalizeAnswer(value)}  `;
  const vector: Embedding = new Map();
  for (let index = 0; index <= normalized.length - ngramSize; index += 1) {
    const gram = normalized.slice(index, index + ngramSize);
    vector.set(gram, (vector.get(gram) ?? 0) + 1);
  }
  return vector;
}

export function cosineSimilarity(left: Embedding, right: Embedding) {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (const value of left.values()) {
    leftNorm += value * value;
  }
  for (const value of right.values()) {
    rightNorm += value * value;
  }
  for (const [key, value] of left.entries()) {
    dot += value * (right.get(key) ?? 0);
  }

  if (leftNorm === 0 || rightNorm === 0) return 0;
  return dot / Math.sqrt(leftNorm * rightNorm);
}

export function semanticSimilarity(expected: string, actual: string) {
  return cosineSimilarity(embedText(expected), embedText(actual));
}
