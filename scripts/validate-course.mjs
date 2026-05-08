import { readFileSync } from 'node:fs';

const courseSource = readFileSync('src/data/course.ts', 'utf8');
const lessonMatches = [...courseSource.matchAll(/id: '([a-z0-9-]+)'/g)].map((match) => match[1]);
const duplicates = lessonMatches.filter((id, index) => lessonMatches.indexOf(id) !== index);

if (duplicates.length > 0) {
  console.error(`Duplicate course ids: ${[...new Set(duplicates)].join(', ')}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, ids: lessonMatches.length }));
