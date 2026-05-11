import type { Lesson } from '../lib/types';

export const courseVersion = 'es-quickstart-v2';

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
  },
  {
    id: 'food-1',
    title: 'At the table',
    description: 'Order food, share dishes, and say what you like.',
    accent: '#dc2626',
    unlockXp: 65,
    words: [
      { id: 'pan', native: 'bread', target: 'pan', phonetic: 'PAHN' },
      { id: 'queso', native: 'cheese', target: 'queso', phonetic: 'KEH-soh' },
      { id: 'manzana', native: 'apple', target: 'manzana', phonetic: 'mahn-SAH-nah' },
      { id: 'me-gusta', native: 'I like', target: 'me gusta', phonetic: 'meh GOO-stah' }
    ],
    exercises: [
      {
        id: 'food-choice-pan',
        lessonId: 'food-1',
        cardId: 'card-pan',
        kind: 'choice',
        prompt: 'bread',
        answer: 'pan',
        options: ['pan', 'queso', 'leche', 'arroz'],
        explanation: 'Pan is the everyday word for bread in Spain and Latin America.'
      },
      {
        id: 'food-type-manzana',
        lessonId: 'food-1',
        cardId: 'card-manzana',
        kind: 'type',
        prompt: 'I want an apple',
        answer: 'quiero una manzana',
        accepted: ['quiero una manzana', 'quiero la manzana', 'yo quiero una manzana'],
        hint: 'quiero una...',
        explanation: 'Manzana is feminine, so it takes una.'
      },
      {
        id: 'food-speak-queso',
        lessonId: 'food-1',
        cardId: 'card-queso',
        kind: 'speak',
        prompt: 'Say: me gusta el queso',
        answer: 'me gusta el queso',
        phonetic: 'meh GOO-stah el KEH-soh',
        targetHz: 175,
        explanation: 'Keep gusta short — the stress lives on GOO.'
      },
      {
        id: 'food-grammar-gusta',
        lessonId: 'food-1',
        cardId: 'card-me-gusta',
        kind: 'grammar',
        prompt: 'Fix the phrase',
        flawed: 'yo gusta la manzana',
        answer: 'me gusta la manzana',
        rule: 'With gustar the thing liked is the subject; the person is an indirect object pronoun.',
        explanation: 'Me gusta la manzana literally reads "the apple is pleasing to me."'
      }
    ]
  },
  {
    id: 'family-1',
    title: 'Family ties',
    description: 'Introduce your family and describe relationships.',
    accent: '#7c3aed',
    unlockXp: 90,
    words: [
      { id: 'madre', native: 'mother', target: 'madre', phonetic: 'MAH-dreh' },
      { id: 'padre', native: 'father', target: 'padre', phonetic: 'PAH-dreh' },
      { id: 'hermano', native: 'brother', target: 'hermano', phonetic: 'er-MAH-noh' },
      { id: 'hijo', native: 'son', target: 'hijo', phonetic: 'EE-hoh' }
    ],
    exercises: [
      {
        id: 'family-choice-madre',
        lessonId: 'family-1',
        cardId: 'card-madre',
        kind: 'choice',
        prompt: 'mother',
        answer: 'madre',
        options: ['madre', 'padre', 'hermana', 'tia'],
        explanation: 'Madre is the standard word; mama is the affectionate form.'
      },
      {
        id: 'family-type-padre',
        lessonId: 'family-1',
        cardId: 'card-padre',
        kind: 'type',
        prompt: 'My father is tall',
        answer: 'mi padre es alto',
        accepted: ['mi padre es alto', 'mi papa es alto'],
        hint: 'mi padre es...',
        explanation: 'Use ser (es) for permanent traits like height.'
      },
      {
        id: 'family-speak-hermano',
        lessonId: 'family-1',
        cardId: 'card-hermano',
        kind: 'speak',
        prompt: 'Say: mi hermano',
        answer: 'mi hermano',
        phonetic: 'mee er-MAH-noh',
        targetHz: 170,
        explanation: 'The h in hermano is silent; lead straight into the rolled r.'
      },
      {
        id: 'family-grammar-hijo',
        lessonId: 'family-1',
        cardId: 'card-hijo',
        kind: 'grammar',
        prompt: 'Fix the phrase',
        flawed: 'tengo un hijo y una hijo',
        answer: 'tengo un hijo y una hija',
        rule: 'Adjust the noun ending to match the child you mean: hijo (son) and hija (daughter).',
        explanation: 'Spanish nouns inflect for gender; switching to hija agrees with una.'
      }
    ]
  },
  {
    id: 'numbers-1',
    title: 'Counting and shopping',
    description: 'Count items, ask prices, and pay in confidence.',
    accent: '#0891b2',
    unlockXp: 115,
    words: [
      { id: 'uno', native: 'one', target: 'uno', phonetic: 'OO-noh' },
      { id: 'dos', native: 'two', target: 'dos', phonetic: 'DOHS' },
      { id: 'cuanto', native: 'how much', target: 'cuanto', phonetic: 'KWAHN-toh' },
      { id: 'euro', native: 'euro', target: 'euro', phonetic: 'EH-oo-roh' }
    ],
    exercises: [
      {
        id: 'numbers-choice-dos',
        lessonId: 'numbers-1',
        cardId: 'card-dos',
        kind: 'choice',
        prompt: 'two',
        answer: 'dos',
        options: ['dos', 'doce', 'diez', 'dia'],
        explanation: 'Dos is two; doce is twelve.'
      },
      {
        id: 'numbers-type-cuanto',
        lessonId: 'numbers-1',
        cardId: 'card-cuanto',
        kind: 'type',
        prompt: 'How much does it cost?',
        answer: 'cuanto cuesta',
        accepted: ['cuanto cuesta', 'cuanto es', 'cuanto vale'],
        hint: 'cuanto...',
        explanation: 'Cuanto cuesta and cuanto vale both ask for the price.'
      },
      {
        id: 'numbers-speak-uno',
        lessonId: 'numbers-1',
        cardId: 'card-uno',
        kind: 'speak',
        prompt: 'Say: uno, dos, tres',
        answer: 'uno dos tres',
        phonetic: 'OO-noh DOHS trehs',
        targetHz: 180,
        explanation: 'Keep each number clean and short.'
      },
      {
        id: 'numbers-grammar-euro',
        lessonId: 'numbers-1',
        cardId: 'card-euro',
        kind: 'grammar',
        prompt: 'Fix the phrase',
        flawed: 'cuesta dos euro',
        answer: 'cuesta dos euros',
        rule: 'Pluralise the noun when the quantity is greater than one.',
        explanation: 'Cuesta dos euros — when you have more than one euro the noun takes an s.'
      }
    ]
  },
  {
    id: 'weather-1',
    title: 'Weather and seasons',
    description: 'Talk about the weather and plan around it.',
    accent: '#0ea5e9',
    unlockXp: 140,
    words: [
      { id: 'sol', native: 'sun', target: 'sol', phonetic: 'SOHL' },
      { id: 'lluvia', native: 'rain', target: 'lluvia', phonetic: 'YOO-vyah' },
      { id: 'frio', native: 'cold', target: 'frio', phonetic: 'FREE-oh' },
      { id: 'calor', native: 'heat', target: 'calor', phonetic: 'kah-LOHR' }
    ],
    exercises: [
      {
        id: 'weather-choice-sol',
        lessonId: 'weather-1',
        cardId: 'card-sol',
        kind: 'choice',
        prompt: 'sun',
        answer: 'sol',
        options: ['sol', 'sal', 'cielo', 'nube'],
        explanation: 'Sol means sun; sal means salt.'
      },
      {
        id: 'weather-type-lluvia',
        lessonId: 'weather-1',
        cardId: 'card-lluvia',
        kind: 'type',
        prompt: 'It is raining today',
        answer: 'hoy llueve',
        accepted: ['hoy llueve', 'esta lloviendo', 'llueve hoy'],
        hint: 'hoy ll...',
        explanation: 'Llueve is the simple present; esta lloviendo emphasises right now.'
      },
      {
        id: 'weather-speak-frio',
        lessonId: 'weather-1',
        cardId: 'card-frio',
        kind: 'speak',
        prompt: 'Say: hace frio',
        answer: 'hace frio',
        phonetic: 'AH-seh FREE-oh',
        targetHz: 170,
        explanation: 'Hace + temperature is the natural way to say "it is cold/hot."'
      },
      {
        id: 'weather-grammar-calor',
        lessonId: 'weather-1',
        cardId: 'card-calor',
        kind: 'grammar',
        prompt: 'Fix the phrase',
        flawed: 'es mucho calor hoy',
        answer: 'hace mucho calor hoy',
        rule: 'Use hacer (not ser) with weather phrases like calor, frio, sol, viento.',
        explanation: 'Hace mucho calor hoy — Spanish makes the weather, it does not be it.'
      }
    ]
  },
  {
    id: 'work-1',
    title: 'Workday Spanish',
    description: 'Talk about meetings, deadlines, and asking for help.',
    accent: '#4f46e5',
    unlockXp: 165,
    words: [
      { id: 'oficina', native: 'office', target: 'oficina', phonetic: 'oh-fee-SEE-nah' },
      { id: 'reunion', native: 'meeting', target: 'reunion', phonetic: 'reh-oo-NYOHN' },
      { id: 'proyecto', native: 'project', target: 'proyecto', phonetic: 'pro-YEHK-toh' },
      { id: 'ayuda', native: 'help', target: 'ayuda', phonetic: 'ah-YOO-dah' }
    ],
    exercises: [
      {
        id: 'work-choice-oficina',
        lessonId: 'work-1',
        cardId: 'card-oficina',
        kind: 'choice',
        prompt: 'office',
        answer: 'oficina',
        options: ['oficina', 'cocina', 'tienda', 'reunion'],
        explanation: 'Oficina is office; cocina is kitchen.'
      },
      {
        id: 'work-type-reunion',
        lessonId: 'work-1',
        cardId: 'card-reunion',
        kind: 'type',
        prompt: 'The meeting is at three',
        answer: 'la reunion es a las tres',
        accepted: ['la reunion es a las tres', 'la reunion es a las 3'],
        hint: 'la reunion es...',
        explanation: 'Time of an event uses ser: la reunion ES a las tres.'
      },
      {
        id: 'work-speak-proyecto',
        lessonId: 'work-1',
        cardId: 'card-proyecto',
        kind: 'speak',
        prompt: 'Say: el proyecto',
        answer: 'el proyecto',
        phonetic: 'el pro-YEHK-toh',
        targetHz: 175,
        explanation: 'Stress lands on YEHK in proyecto.'
      },
      {
        id: 'work-grammar-ayuda',
        lessonId: 'work-1',
        cardId: 'card-ayuda',
        kind: 'grammar',
        prompt: 'Fix the phrase',
        flawed: 'necesito una ayuda con el proyecto',
        answer: 'necesito ayuda con el proyecto',
        rule: 'Uncountable nouns like ayuda usually drop the indefinite article.',
        explanation: 'Necesito ayuda con el proyecto sounds natural; the article would feel awkward.'
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
