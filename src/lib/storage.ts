import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { lessons } from '../data/course';
import type { Attempt, LocalingoState, Profile, ReviewCard, Settings } from './types';

interface LocalingoDb extends DBSchema {
  profile: {
    key: string;
    value: Profile;
  };
  cards: {
    key: string;
    value: ReviewCard;
  };
  attempts: {
    key: string;
    value: Attempt;
    indexes: { 'by-at': string };
  };
  settings: {
    key: string;
    value: Settings;
  };
}

let dbPromise: Promise<IDBPDatabase<LocalingoDb>> | null = null;

function getDb() {
  dbPromise ??= openDB<LocalingoDb>('localingo', 1, {
    upgrade(db) {
      db.createObjectStore('profile');
      db.createObjectStore('cards', { keyPath: 'id' });
      const attempts = db.createObjectStore('attempts', { keyPath: 'id' });
      attempts.createIndex('by-at', 'at');
      db.createObjectStore('settings');
    }
  });
  return dbPromise;
}

export function createInitialState(now = new Date()): LocalingoState {
  const cards = lessons.flatMap((lesson) =>
    lesson.words.map<ReviewCard>((word) => ({
      id: `card-${word.id}`,
      lessonId: lesson.id,
      front: word.native,
      back: word.target,
      dueAt: now.toISOString(),
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0
    }))
  );

  return {
    schemaVersion: 1,
    profile: {
      name: 'Local learner',
      xp: 0,
      streak: 0,
      lastPracticeDate: null,
      totalMinutes: 0,
      completedLessons: []
    },
    cards,
    attempts: [],
    settings: {
      dailyGoalXp: 30,
      voiceEnabled: true
    }
  };
}

export async function loadState() {
  const db = await getDb();
  const profile = await db.get('profile', 'default');
  if (!profile) {
    const initial = createInitialState();
    await saveState(initial);
    return initial;
  }

  const [cards, attempts, settings] = await Promise.all([
    db.getAll('cards'),
    db.getAllFromIndex('attempts', 'by-at'),
    db.get('settings', 'default')
  ]);

  return {
    schemaVersion: 1,
    profile,
    cards,
    attempts,
    settings:
      settings ??
      ({
        dailyGoalXp: 30,
        voiceEnabled: true
      } satisfies Settings)
  } satisfies LocalingoState;
}

export async function saveState(state: LocalingoState) {
  const db = await getDb();
  const tx = db.transaction(['profile', 'cards', 'attempts', 'settings'], 'readwrite');
  await Promise.all([
    tx.objectStore('profile').put(state.profile, 'default'),
    tx.objectStore('settings').put(state.settings, 'default'),
    replaceStore(tx.objectStore('cards'), state.cards),
    replaceStore(tx.objectStore('attempts'), state.attempts),
    tx.done
  ]);
}

export async function resetState() {
  const initial = createInitialState();
  await saveState(initial);
  return initial;
}

async function replaceStore<T>(
  store: { clear(): Promise<void>; put(value: T): Promise<IDBValidKey> },
  values: T[]
) {
  await store.clear();
  await Promise.all(values.map((value) => store.put(value)));
}
