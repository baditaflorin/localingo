import type { Lesson } from '../lib/types';

export const courseVersion = 'es-quickstart-v1';

export const lessons: Lesson[] = [
  {
    id: 'basics-1',
    title: 'Cafe basics',
    description: 'Order, greet, and answer with confidence.',
    accent: '#0f766e',
    unlockXp: 0,
    words: [
      { id: 'hola', native: 'hello', target: 'hola', phonetic: 'OH-lah' },
      { id: 'gracias', native: 'thank you', target: 'gracias', phonetic: 'GRAH-syahs' },
      { id: 'cafe', native: 'coffee', target: 'cafe', phonetic: 'kah-FEH' },
      { id: 'agua', native: 'water', target: 'agua', phonetic: 'AH-gwah' }
    ],
    exercises: [
      {
        id: 'basics-choice-hola',
        lessonId: 'basics-1',
        cardId: 'card-hola',
        kind: 'choice',
        prompt: 'hello',
        answer: 'hola',
        options: ['hola', 'adios', 'perdon', 'noche'],
        explanation: 'Hola is the everyday greeting.'
      },
      {
        id: 'basics-type-gracias',
        lessonId: 'basics-1',
        cardId: 'card-gracias',
        kind: 'type',
        prompt: 'thank you',
        answer: 'gracias',
        accepted: ['gracias', 'muchas gracias'],
        hint: 'Starts with gra...',
        explanation: 'Gracias works in casual and formal settings.'
      },
      {
        id: 'basics-speak-cafe',
        lessonId: 'basics-1',
        cardId: 'card-cafe',
        kind: 'speak',
        prompt: 'Say: cafe',
        answer: 'cafe',
        phonetic: 'kah-FEH',
        targetHz: 180,
        explanation: 'Keep the stress on the last syllable.'
      },
      {
        id: 'basics-grammar-agua',
        lessonId: 'basics-1',
        cardId: 'card-agua',
        kind: 'grammar',
        prompt: 'Fix the phrase',
        flawed: 'quiero el agua por favor',
        answer: 'quiero agua, por favor',
        rule: 'Common nouns can drop the article after quiero when ordering.',
        explanation: 'Quiero agua, por favor sounds natural when ordering water.'
      }
    ]
  },
  {
    id: 'travel-1',
    title: 'Street directions',
    description: 'Find places, ask politely, and recover when lost.',
    accent: '#f97361',
    unlockXp: 20,
    words: [
      { id: 'donde', native: 'where', target: 'donde', phonetic: 'DOHN-deh' },
      { id: 'bano', native: 'bathroom', target: 'bano', phonetic: 'BAH-nyoh' },
      { id: 'izquierda', native: 'left', target: 'izquierda', phonetic: 'ees-KYEHR-dah' },
      { id: 'derecha', native: 'right', target: 'derecha', phonetic: 'deh-REH-chah' }
    ],
    exercises: [
      {
        id: 'travel-choice-donde',
        lessonId: 'travel-1',
        cardId: 'card-donde',
        kind: 'choice',
        prompt: 'where',
        answer: 'donde',
        options: ['donde', 'cuando', 'cuanto', 'quien'],
        explanation: 'Donde asks about place.'
      },
      {
        id: 'travel-type-bano',
        lessonId: 'travel-1',
        cardId: 'card-bano',
        kind: 'type',
        prompt: 'Where is the bathroom?',
        answer: 'donde esta el bano',
        accepted: ['donde esta el bano', 'donde esta el baño'],
        hint: 'donde esta...',
        explanation: 'Accents are helpful but not required for this drill.'
      },
      {
        id: 'travel-speak-derecha',
        lessonId: 'travel-1',
        cardId: 'card-derecha',
        kind: 'speak',
        prompt: 'Say: derecha',
        answer: 'derecha',
        phonetic: 'deh-REH-chah',
        targetHz: 190,
        explanation: 'Keep the middle syllable clear and steady.'
      },
      {
        id: 'travel-grammar-izquierda',
        lessonId: 'travel-1',
        cardId: 'card-izquierda',
        kind: 'grammar',
        prompt: 'Fix the phrase',
        flawed: 'a la izquierda esta el museo',
        answer: 'el museo esta a la izquierda',
        rule: 'Place the subject before esta in a direct location sentence.',
        explanation: 'El museo esta a la izquierda is the neutral sentence order.'
      }
    ]
  },
  {
    id: 'daily-1',
    title: 'Daily rhythm',
    description: 'Talk about habits and what you want to do next.',
    accent: '#f5b942',
    unlockXp: 45,
    words: [
      { id: 'quiero', native: 'I want', target: 'quiero', phonetic: 'KYEH-roh' },
      { id: 'aprendo', native: 'I learn', target: 'aprendo', phonetic: 'ah-PREN-doh' },
      { id: 'hoy', native: 'today', target: 'hoy', phonetic: 'oy' },
      { id: 'manana', native: 'tomorrow', target: 'manana', phonetic: 'mah-NYAH-nah' }
    ],
    exercises: [
      {
        id: 'daily-choice-hoy',
        lessonId: 'daily-1',
        cardId: 'card-hoy',
        kind: 'choice',
        prompt: 'today',
        answer: 'hoy',
        options: ['hoy', 'ayer', 'manana', 'nunca'],
        explanation: 'Hoy means today.'
      },
      {
        id: 'daily-type-aprendo',
        lessonId: 'daily-1',
        cardId: 'card-aprendo',
        kind: 'type',
        prompt: 'I learn Spanish today',
        answer: 'aprendo espanol hoy',
        accepted: [
          'aprendo espanol hoy',
          'aprendo español hoy',
          'yo aprendo espanol hoy',
          'yo aprendo español hoy'
        ],
        hint: 'aprendo...',
        explanation: 'Subject pronouns are optional in Spanish.'
      },
      {
        id: 'daily-speak-quiero',
        lessonId: 'daily-1',
        cardId: 'card-quiero',
        kind: 'speak',
        prompt: 'Say: quiero aprender',
        answer: 'quiero aprender',
        phonetic: 'KYEH-roh ah-pren-DEHR',
        targetHz: 175,
        explanation: 'Keep quiero short and give aprender a clean final r.'
      },
      {
        id: 'daily-grammar-manana',
        lessonId: 'daily-1',
        cardId: 'card-manana',
        kind: 'grammar',
        prompt: 'Fix the phrase',
        flawed: 'yo quiero aprender manana espanol',
        answer: 'quiero aprender espanol manana',
        rule: 'Time words usually land after the object in this sentence.',
        explanation: 'Quiero aprender espanol manana keeps the action together.'
      }
    ]
  }
];

export function findLesson(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function allExercises() {
  return lessons.flatMap((lesson) => lesson.exercises);
}
