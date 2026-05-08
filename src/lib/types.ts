export type ExerciseKind = 'choice' | 'type' | 'speak' | 'grammar';

export interface CourseWord {
  id: string;
  native: string;
  target: string;
  phonetic: string;
}

export interface BaseExercise {
  id: string;
  lessonId: string;
  cardId: string;
  kind: ExerciseKind;
  prompt: string;
  answer: string;
  explanation: string;
}

export interface ChoiceExercise extends BaseExercise {
  kind: 'choice';
  options: string[];
}

export interface TypeExercise extends BaseExercise {
  kind: 'type';
  accepted: string[];
  hint: string;
}

export interface SpeakExercise extends BaseExercise {
  kind: 'speak';
  phonetic: string;
  targetHz: number;
}

export interface GrammarExercise extends BaseExercise {
  kind: 'grammar';
  flawed: string;
  rule: string;
}

export type Exercise = ChoiceExercise | TypeExercise | SpeakExercise | GrammarExercise;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  accent: string;
  unlockXp: number;
  words: CourseWord[];
  exercises: Exercise[];
}

export interface ReviewCard {
  id: string;
  lessonId: string;
  front: string;
  back: string;
  dueAt: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lapses: number;
}

export interface Attempt {
  id: string;
  exerciseId: string;
  lessonId: string;
  at: string;
  correct: boolean;
  score: number;
  response: string;
}

export interface Profile {
  name: string;
  xp: number;
  streak: number;
  lastPracticeDate: string | null;
  totalMinutes: number;
  completedLessons: string[];
}

export interface Settings {
  dailyGoalXp: number;
  voiceEnabled: boolean;
}

export interface LocalingoState {
  schemaVersion: 1;
  profile: Profile;
  cards: ReviewCard[];
  attempts: Attempt[];
  settings: Settings;
}
