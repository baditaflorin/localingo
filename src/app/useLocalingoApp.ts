import { useEffect, useRef, useState } from 'react';
import { qualityFromScore, scheduleReview, type ReviewQuality } from '../features/review/srs';
import { exportStateJson, parseImportedState } from '../lib/exportImport';
import { logger } from '../lib/logger';
import { createShareHash, parseSharedHash } from '../lib/share';
import { createInitialState, loadState, resetState, saveState } from '../lib/storage';
import type { ActivityLogEntry, Exercise, LocalingoState, ReviewCard, Settings } from '../lib/types';

export interface AppNotice {
  tone: 'info' | 'success' | 'warning' | 'error';
  title: string;
  detail: string;
}

export type SaveStatus = 'hydrating' | 'saving' | 'saved' | 'error';
export type TabKey = 'lesson' | 'review' | 'generate' | 'progress' | 'settings';

const uiStorageKey = 'localingo-ui-v1';
const xpPerCorrect = 10;
const xpPerPartial = 4;

interface UiState {
  selectedLessonId: string;
  activeTab: TabKey;
}

export function useLocalingoApp(initialLessonId: string) {
  const [state, setState] = useState<LocalingoState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(initialLessonId);
  const [activeTab, setActiveTab] = useState<TabKey>('lesson');
  const [notice, setNotice] = useState<AppNotice | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('hydrating');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);
  const appliedHashRef = useRef(false);

  useEffect(() => {
    const savedUiState = loadUiState();
    if (savedUiState) {
      setSelectedLessonId(savedUiState.selectedLessonId);
      setActiveTab(savedUiState.activeTab);
    }

    void loadState()
      .then((stored) => {
        const importedFromHash = tryLoadShareHash(stored);
        setState(importedFromHash.state);
        if (importedFromHash.notice) {
          setNotice(importedFromHash.notice);
          setActiveTab('progress');
        }
        setHydrated(true);
        setSaveStatus('saved');
        setLastSavedAt(new Date().toISOString());
      })
      .catch((error: unknown) => {
        logger.error(error, 'Failed to hydrate Localingo state');
        setHydrated(true);
        setSaveStatus('error');
        setNotice({
          tone: 'error',
          title: 'Local progress could not be restored',
          detail: 'Localingo started with a fresh profile because stored data could not be loaded.'
        });
      });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistUiState({ activeTab, selectedLessonId });
  }, [activeTab, hydrated, selectedLessonId]);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    setSaveStatus('saving');
    saveTimer.current = window.setTimeout(() => {
      void saveState(state)
        .then(() => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toISOString());
        })
        .catch((error: unknown) => {
          logger.error(error, 'Failed to save Localingo state');
          setSaveStatus('error');
          setNotice({
            tone: 'error',
            title: 'Progress was not saved',
            detail: 'Your browser blocked the save. Keep this tab open and try exporting a backup.'
          });
        });
    }, 250);

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [hydrated, state]);

  function updateSettings(next: Settings) {
    setState((current) =>
      withActivity({ ...current, settings: next }, 'settings', 'Updated Localingo settings')
    );
    setNotice({
      tone: 'success',
      title: 'Settings saved',
      detail: 'Your Localingo preferences will be restored on the next visit.'
    });
  }

  function updateProfileName(name: string) {
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        name
      }
    }));
  }

  function recordAttempt(
    exercise: Exercise,
    response: string,
    score: number,
    correct: boolean,
    message: string
  ) {
    const now = new Date();
    const quality = qualityFromScore(score);

    setState((current) => {
      const attempts = [
        ...current.attempts,
        {
          id: crypto.randomUUID(),
          exerciseId: exercise.id,
          lessonId: exercise.lessonId,
          at: now.toISOString(),
          correct,
          score,
          response
        }
      ];
      const completedLessons = correct
        ? [...new Set([...current.profile.completedLessons, exercise.lessonId])]
        : current.profile.completedLessons;
      const xp = current.profile.xp + (correct ? xpPerCorrect : score >= 0.6 ? xpPerPartial : 0);
      const lastPracticeDate = localDateKey(now);
      const streak = updateStreak(current.profile.lastPracticeDate, now, current.profile.streak);
      const cards = current.cards.map((card) =>
        card.id === exercise.cardId ? scheduleReview(card, quality, now) : card
      );

      return withActivity(
        {
          ...current,
          profile: {
            ...current.profile,
            xp,
            streak,
            lastPracticeDate,
            completedLessons
          },
          cards,
          attempts
        },
        'lesson',
        message
      );
    });
  }

  function reviewCard(card: ReviewCard, quality: ReviewQuality) {
    setState((current) =>
      withActivity(
        {
          ...current,
          profile: {
            ...current.profile,
            xp: current.profile.xp + (quality >= 3 ? 6 : 0),
            streak: updateStreak(current.profile.lastPracticeDate, new Date(), current.profile.streak),
            lastPracticeDate: localDateKey(new Date())
          },
          cards: current.cards.map((item) => (item.id === card.id ? scheduleReview(item, quality) : item))
        },
        'review',
        `Reviewed ${card.front} -> ${card.back} as ${reviewQualityLabel(quality)}`
      )
    );
  }

  function exportJson() {
    const content = exportStateJson(state);
    downloadText('localingo-progress.json', content);
    setState((current) => withActivity(current, 'export', 'Exported Localingo state as JSON'));
    setNotice({
      tone: 'success',
      title: 'Export ready',
      detail: 'A Localingo backup file was downloaded for you.'
    });
    return content;
  }

  async function copyExportToClipboard() {
    try {
      const content = exportStateJson(state);
      await navigator.clipboard.writeText(content);
      setState((current) => withActivity(current, 'export', 'Copied Localingo state JSON to the clipboard'));
      setNotice({
        tone: 'success',
        title: 'Copied export',
        detail: 'Your Localingo state JSON is on the clipboard.'
      });
    } catch (error: unknown) {
      logger.error(error, 'Failed to copy export');
      setNotice({
        tone: 'error',
        title: 'Clipboard copy failed',
        detail: 'Your browser blocked clipboard access. Use Download JSON instead.'
      });
    }
  }

  async function copyShareLink() {
    try {
      const hash = createShareHash(state);
      const shareUrl = `${location.origin}${location.pathname}${hash}`;
      await navigator.clipboard.writeText(shareUrl);
      setState((current) => withActivity(current, 'share', 'Copied a shareable Localingo state URL'));
      setNotice({
        tone: 'success',
        title: 'Share link copied',
        detail: 'Anyone with the link can load this state locally in their browser.'
      });
      return shareUrl;
    } catch (error: unknown) {
      logger.error(error, 'Failed to copy share link');
      setNotice({
        tone: 'error',
        title: 'Share link could not be copied',
        detail: 'Your browser blocked clipboard access. Export JSON instead for handoff.'
      });
      return null;
    }
  }

  function importText(content: string, source: 'file' | 'paste' | 'share') {
    const imported = parseImportedState(content);
    setState(
      withActivity(
        imported,
        'import',
        source === 'share' ? 'Loaded Localingo state from a share link' : 'Imported Localingo state'
      )
    );
    setActiveTab('progress');
    setNotice({
      tone: 'success',
      title: source === 'share' ? 'Shared state loaded' : 'Import complete',
      detail: 'Localingo restored the imported learning state and moved you to the Progress tab.'
    });
  }

  async function importFile(file: File) {
    try {
      importText(await file.text(), 'file');
    } catch (error: unknown) {
      setNotice(parseImportError(error));
    }
  }

  function importFromPaste(content: string) {
    try {
      importText(content, 'paste');
      return true;
    } catch (error: unknown) {
      setNotice(parseImportError(error));
      return false;
    }
  }

  async function resetProgress() {
    const next = await resetState();
    setState(withActivity(next, 'reset', 'Reset Localingo progress to the starter state'));
    setActiveTab('lesson');
    setNotice({
      tone: 'success',
      title: 'Progress reset',
      detail: 'A fresh Localingo profile was created in this browser.'
    });
  }

  return {
    state,
    setState,
    hydrated,
    selectedLessonId,
    setSelectedLessonId,
    activeTab,
    setActiveTab,
    notice,
    setNotice,
    saveStatus,
    lastSavedAt,
    updateSettings,
    updateProfileName,
    recordAttempt,
    reviewCard,
    exportJson,
    copyExportToClipboard,
    copyShareLink,
    importFile,
    importFromPaste,
    resetProgress
  };

  function tryLoadShareHash(fallbackState: LocalingoState): {
    state: LocalingoState;
    notice: AppNotice | null;
  } {
    if (appliedHashRef.current) {
      return { state: fallbackState, notice: null as AppNotice | null };
    }
    appliedHashRef.current = true;

    try {
      const sharedState = parseSharedHash(location.hash);
      if (!sharedState) {
        return { state: fallbackState, notice: null };
      }
      return {
        state: withActivity(sharedState, 'share', 'Opened Localingo from a shared link'),
        notice: {
          tone: 'info',
          title: 'Shared state detected',
          detail: 'This tab loaded a Localingo state from the URL. Export it if you want a file backup.'
        }
      };
    } catch (error: unknown) {
      logger.error(error, 'Failed to import shared hash state');
      return {
        state: fallbackState,
        notice: {
          tone: 'error',
          title: 'Shared state could not be opened',
          detail:
            'The URL payload is not a valid Localingo share link. The last saved local state stayed in place.'
        }
      };
    }
  }
}

function loadUiState(): UiState | null {
  try {
    const raw = localStorage.getItem(uiStorageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const candidate = parsed as Partial<UiState>;
    if (typeof candidate.selectedLessonId !== 'string' || typeof candidate.activeTab !== 'string') {
      return null;
    }
    return {
      selectedLessonId: candidate.selectedLessonId,
      activeTab: candidate.activeTab as TabKey
    };
  } catch {
    return null;
  }
}

function persistUiState(value: UiState) {
  localStorage.setItem(uiStorageKey, JSON.stringify(value));
}

function withActivity(
  state: LocalingoState,
  kind: ActivityLogEntry['kind'],
  message: string
): LocalingoState {
  const nextEntry: ActivityLogEntry = {
    id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    kind,
    message
  };

  return {
    ...state,
    activityLog: [nextEntry, ...state.activityLog].slice(0, 60)
  };
}

// Calendar-day key in the learner's local timezone (not UTC). Streaks are a
// wall-clock, local concept: a "day" boundary should match what the learner
// sees on their own clock, not when UTC happens to roll over. Using
// `toISOString().slice(0, 10)` here would key days by UTC, which silently
// mis-tracks the streak for every learner outside UTC+0 (e.g. two practice
// sessions on genuinely different local calendar days can land on the same
// UTC date near midnight, so the streak fails to increment).
export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function updateStreak(lastPracticeDate: string | null, now: Date, currentStreak: number) {
  const today = localDateKey(now);
  if (lastPracticeDate === today) return Math.max(1, currentStreak);
  if (!lastPracticeDate) return 1;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return lastPracticeDate === localDateKey(yesterday) ? currentStreak + 1 : 1;
}

function reviewQualityLabel(quality: ReviewQuality) {
  switch (quality) {
    case 1:
      return 'again';
    case 3:
      return 'hard';
    case 4:
      return 'good';
    case 5:
      return 'easy';
    default:
      return `quality-${quality}`;
  }
}

function parseImportError(error: unknown): AppNotice {
  const detail = error instanceof Error ? error.message : 'Localingo could not read that input.';
  return {
    tone: 'error',
    title: 'Import failed',
    detail: `${detail} Use a Localingo export JSON file or a Localingo share payload.`
  };
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function goalProgress(state: LocalingoState) {
  const progress = Math.min(1, state.profile.xp / Math.max(1, state.settings.dailyGoalXp));
  return {
    current: state.profile.xp,
    target: state.settings.dailyGoalXp,
    ratio: progress
  };
}
