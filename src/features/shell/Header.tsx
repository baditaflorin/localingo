import { Github, Heart, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { buildInfo } from '../../lib/buildInfo';
import { fetchMainCommit } from '../../lib/github';
import type { SaveStatus } from '../../app/useLocalingoApp';

export function Header({
  learnerName,
  saveStatus,
  lastSavedAt
}: {
  learnerName: string;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
}) {
  const commit = useQuery({
    queryKey: ['github-main-commit', buildInfo.repository],
    queryFn: () => fetchMainCommit(buildInfo.repository),
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  return (
    <header className="border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center bg-mint text-xl font-black text-white">Lo</div>
          <div>
            <h1 className="text-xl font-black tracking-normal">Localingo</h1>
            <p className="text-sm text-slate-600">
              {learnerName
                ? `${learnerName}'s local language practice`
                : 'Private language practice, stored locally'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="version-pill">{describeSaveStatus(saveStatus, lastSavedAt)}</div>
          <a className="toolbar-link" href={buildInfo.repositoryUrl} target="_blank" rel="noreferrer">
            <Github size={16} />
            Star on GitHub
          </a>
          <a className="toolbar-link" href={buildInfo.paypalUrl} target="_blank" rel="noreferrer">
            <Heart size={16} />
            PayPal
          </a>
          <a className="toolbar-link" href={buildInfo.pagesUrl} target="_blank" rel="noreferrer">
            <Star size={16} />
            Live
          </a>
          <div className="version-pill">
            v{buildInfo.version} ·{' '}
            {commit.data ? (
              <a href={commit.data.url} target="_blank" rel="noreferrer">
                {commit.data.shortSha}
              </a>
            ) : (
              buildInfo.buildCommit
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function describeSaveStatus(saveStatus: SaveStatus, lastSavedAt: string | null) {
  switch (saveStatus) {
    case 'hydrating':
      return 'Restoring local progress...';
    case 'saving':
      return 'Saving locally...';
    case 'error':
      return 'Local save needs attention';
    case 'saved':
      return lastSavedAt
        ? `Saved ${new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : 'Saved locally';
    default:
      return 'Local progress';
  }
}
