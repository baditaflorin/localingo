const accentMap: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ü: 'u',
  ñ: 'n'
};

export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (char) => accentMap[char] ?? char)
    .replace(/[¿?¡!.,;]/g, '')
    .replace(/\s+/g, ' ');
}

export function tokenize(value: string) {
  return normalizeAnswer(value).split(' ').filter(Boolean);
}

export function editSimilarity(expected: string, actual: string) {
  const a = normalizeAnswer(expected);
  const b = normalizeAnswer(actual);
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  const distance = matrix[a.length][b.length];
  return Math.max(0, 1 - distance / Math.max(a.length, b.length));
}
