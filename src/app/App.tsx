import { useMemo } from 'react';
import { lessons } from '../data/course';
import { getDueCards } from '../features/review/srs';
import { Header } from '../features/shell/Header';
import { NoticeBar } from '../features/shell/NoticeBar';
import { SidePanel } from '../features/shell/SidePanel';
import { StatsRail } from '../features/shell/StatsRail';
import { TabBar } from '../features/shell/TabBar';
import { GenerateWorkspace } from '../features/generation/GenerateWorkspace';
import { LessonWorkspace } from '../features/lesson/LessonWorkspace';
import { ProgressWorkspace } from '../features/progress/ProgressWorkspace';
import { ReviewWorkspace } from '../features/review/ReviewWorkspace';
import { SettingsWorkspace } from '../features/settings/SettingsWorkspace';
import { useLocalingoApp } from './useLocalingoApp';

export function App() {
  const app = useLocalingoApp(lessons[0].id);
  const dueCards = useMemo(() => getDueCards(app.state.cards), [app.state.cards]);
  const debugEnabled = new URLSearchParams(location.search).get('debug') === '1';

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-ink">
      <Header
        learnerName={app.state.profile.name}
        saveStatus={app.saveStatus}
        lastSavedAt={app.lastSavedAt}
      />
      <NoticeBar notice={app.notice} onDismiss={() => app.setNotice(null)} />
      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <StatsRail state={app.state} hydrated={app.hydrated} />
        <section className="min-w-0">
          <TabBar tab={app.activeTab} onTab={app.setActiveTab} />
          {app.activeTab === 'lesson' && (
            <LessonWorkspace
              lessonId={app.selectedLessonId}
              onLesson={app.setSelectedLessonId}
              state={app.state}
              onAttempt={(exercise, response, feedback) => {
                app.recordAttempt(
                  exercise,
                  response,
                  feedback.score,
                  feedback.correct,
                  `${feedback.correct ? 'Completed' : 'Tried'} ${exercise.kind} exercise for ${exercise.prompt}`
                );
              }}
            />
          )}
          {app.activeTab === 'review' && <ReviewWorkspace dueCards={dueCards} onReview={app.reviewCard} />}
          {app.activeTab === 'generate' && <GenerateWorkspace cards={app.state.cards} />}
          {app.activeTab === 'progress' && (
            <ProgressWorkspace
              state={app.state}
              onExport={app.exportJson}
              onCopyExport={app.copyExportToClipboard}
              onShareLink={app.copyShareLink}
              onImport={app.importFromPaste}
              onReset={async () => {
                if (
                  app.state.settings.confirmDestructiveActions &&
                  !window.confirm(
                    'Reset local progress? This will replace your current Localingo state in this browser.'
                  )
                ) {
                  return;
                }
                await app.resetProgress();
              }}
              setNotice={app.setNotice}
            />
          )}
          {app.activeTab === 'settings' && (
            <SettingsWorkspace
              state={app.state}
              onSettings={app.updateSettings}
              onProfileName={app.updateProfileName}
            />
          )}
          {debugEnabled && (
            <section className="mt-4 border border-black/10 bg-white p-4 text-sm">
              <p className="font-black">Debug</p>
              <p className="mt-2">Schema {app.state.schemaVersion}</p>
              <p>Cards {app.state.cards.length}</p>
              <p>Attempts {app.state.attempts.length}</p>
              <p>Activity log {app.state.activityLog.length}</p>
              <p>Selected lesson {app.selectedLessonId}</p>
              <p>Active tab {app.activeTab}</p>
            </section>
          )}
        </section>
        <SidePanel
          state={app.state}
          selectedLessonId={app.selectedLessonId}
          onLesson={app.setSelectedLessonId}
          dueCards={dueCards}
        />
      </main>
    </div>
  );
}
