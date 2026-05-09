import { Activity, BadgeCheck, Copy, Download, Link2, LoaderCircle, Upload } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { runDuckDbSummary, type DuckDbSummary } from '../analytics/duckdbLab';
import { summarizeProgress } from '../analytics/progress';
import type { AppNotice } from '../../app/useLocalingoApp';
import { extractSharedJsonFromUrl } from '../../lib/share';
import type { LocalingoState } from '../../lib/types';

export function ProgressWorkspace({
  state,
  onReset,
  onImport,
  onExport,
  onCopyExport,
  onShareLink,
  setNotice
}: {
  state: LocalingoState;
  onReset: () => Promise<void>;
  onImport: (content: string) => boolean;
  onExport: () => void;
  onCopyExport: () => Promise<void>;
  onShareLink: () => Promise<string | null>;
  setNotice: (notice: AppNotice | null) => void;
}) {
  const [duck, setDuck] = useState<DuckDbSummary | null>(null);
  const [duckError, setDuckError] = useState<string | null>(null);
  const [duckRunning, setDuckRunning] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  const [dropActive, setDropActive] = useState(false);
  const summary = summarizeProgress(state);

  return (
    <div className="workspace p-6">
      <h2 className="text-3xl font-black">Progress</h2>
      <p className="mt-2 text-sm text-slate-600">
        Move your Localingo state between browsers, inspect recent activity, and verify the local analytics
        path.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Metric icon={<Activity />} label="Attempts" value={`${state.attempts.length}`} />
        <Metric icon={<BadgeCheck />} label="Mature cards" value={`${summary.matureCards}`} />
        <Metric icon={<Activity />} label="Activity events" value={`${state.activityLog.length}`} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <button className="secondary-button justify-center" onClick={onExport}>
          <Download size={16} />
          Download JSON
        </button>
        <button className="secondary-button justify-center" onClick={() => void onCopyExport()}>
          <Copy size={16} />
          Copy JSON
        </button>
        <button className="secondary-button justify-center" onClick={() => void onShareLink()}>
          <Link2 size={16} />
          Copy share link
        </button>
      </div>
      <div
        className={`mt-5 border border-dashed p-4 ${dropActive ? 'border-mint bg-[#f0fdfa]' : 'border-black/20 bg-white'}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDropActive(true);
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDropActive(false);
          const file = event.dataTransfer.files?.[0];
          if (!file) return;
          void file.text().then((content) => {
            onImport(content);
          });
        }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black">Import Localingo state</p>
            <p className="text-sm text-slate-600">
              Drop a Localingo JSON file here, paste exported JSON below, or use the file picker.
            </p>
          </div>
          <label className="secondary-button cursor-pointer justify-center">
            <Upload size={16} />
            Choose JSON
            <input
              className="sr-only"
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void file.text().then((content) => {
                  onImport(content);
                });
              }}
            />
          </label>
        </div>
        <textarea
          className="mt-4 min-h-36 w-full border border-black/10 bg-[#fffdf8] p-3 text-sm text-ink"
          value={pasteValue}
          onChange={(event) => setPasteValue(event.target.value)}
          placeholder="Paste a Localingo export JSON or a Localingo share URL here"
        />
        <div className="mt-3 flex flex-col gap-2 md:flex-row">
          <button
            className="secondary-button justify-center"
            onClick={() => {
              const candidate = pasteValue.trim().startsWith('http')
                ? tryDecodeShareUrl(pasteValue.trim())
                : pasteValue.trim();
              if (onImport(candidate)) {
                setPasteValue('');
              }
            }}
          >
            Import pasted state
          </button>
          <button
            className="secondary-button justify-center"
            onClick={() => {
              setPasteValue('');
              setNotice(null);
            }}
          >
            Clear paste area
          </button>
        </div>
      </div>
      <div className="mt-5 border border-black/10 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black">DuckDB-WASM lab</p>
            <p className="text-sm text-slate-600">
              Runs a local SQL summary in the browser. This is optional and never blocks learning.
            </p>
          </div>
          <button
            className="secondary-button"
            disabled={duckRunning}
            onClick={() => {
              setDuckRunning(true);
              setDuckError(null);
              void runDuckDbSummary(state.attempts)
                .then(setDuck)
                .catch((error: unknown) => {
                  setDuckError(error instanceof Error ? error.message : 'DuckDB failed to load.');
                })
                .finally(() => setDuckRunning(false));
            }}
          >
            {duckRunning ? <LoaderCircle className="animate-spin" size={16} /> : null}
            {duckRunning ? 'Running SQL...' : 'Run SQL'}
          </button>
        </div>
        {duck && (
          <p className="mt-3 text-sm font-semibold">
            {duck.engine}: {duck.correct}/{duck.attempts} correct, {Math.round(duck.accuracy * 100)}% accuracy
          </p>
        )}
        {duckError && <p className="mt-3 text-sm font-semibold text-red-700">{duckError}</p>}
      </div>
      <section className="mt-5 border border-black/10 bg-white p-4">
        <p className="font-black">Recent activity</p>
        <div className="mt-3 grid gap-3">
          {state.activityLog.slice(0, 8).map((entry) => (
            <div key={entry.id} className="border border-black/10 bg-[#fffdf8] p-3">
              <p className="text-sm font-bold uppercase text-slate-500">{entry.kind}</p>
              <p className="mt-1 font-semibold">{entry.message}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(entry.at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
      <button className="mt-5 text-sm font-bold text-red-700 underline" onClick={() => void onReset()}>
        Reset local progress
      </button>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="border border-black/10 bg-[#fffdf8] p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center bg-skyglass text-mint">{icon}</div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
          <p className="text-xl font-black">{value}</p>
        </div>
      </div>
    </div>
  );
}

function tryDecodeShareUrl(value: string) {
  try {
    return extractSharedJsonFromUrl(value);
  } catch {
    return value;
  }
}
