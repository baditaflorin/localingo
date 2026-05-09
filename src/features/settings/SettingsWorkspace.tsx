import type { LocalingoState, Settings } from '../../lib/types';

export function SettingsWorkspace({
  state,
  onSettings,
  onProfileName
}: {
  state: LocalingoState;
  onSettings: (settings: Settings) => void;
  onProfileName: (name: string) => void;
}) {
  const settings = state.settings;

  return (
    <div className="workspace p-6">
      <h2 className="text-3xl font-black">Settings</h2>
      <p className="mt-2 text-sm text-slate-600">
        Every setting here changes real behavior and is restored the next time you open Localingo.
      </p>
      <div className="mt-5 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-slate-500">Learner name</span>
          <input
            className="text-input"
            value={state.profile.name}
            onChange={(event) => onProfileName(event.target.value)}
            placeholder="Local learner"
            autoComplete="off"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-slate-500">Daily goal XP</span>
          <input
            className="text-input"
            type="number"
            min={10}
            max={300}
            value={settings.dailyGoalXp}
            onChange={(event) =>
              onSettings({
                ...settings,
                dailyGoalXp: clampNumber(event.target.value, 10, 300, 30)
              })
            }
          />
          <span className="text-sm text-slate-600">
            Shown in the stats rail and used for the daily progress meter.
          </span>
        </label>
        <ToggleRow
          label="Voice practice"
          detail="Controls whether microphone-based pronunciation recording is available in speaking exercises."
          checked={settings.voiceEnabled}
          onCheckedChange={(checked) => onSettings({ ...settings, voiceEnabled: checked })}
        />
        <ToggleRow
          label="Show romanized hints"
          detail="Shows or hides phonetic hints in speaking exercises."
          checked={settings.showRomanizedHints}
          onCheckedChange={(checked) => onSettings({ ...settings, showRomanizedHints: checked })}
        />
        <ToggleRow
          label="Confirm destructive actions"
          detail="Adds a confirmation step before wiping local progress."
          checked={settings.confirmDestructiveActions}
          onCheckedChange={(checked) => onSettings({ ...settings, confirmDestructiveActions: checked })}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  detail,
  checked,
  onCheckedChange
}: {
  label: string;
  detail: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 border border-black/10 bg-white p-4">
      <span className="min-w-0">
        <span className="block font-black">{label}</span>
        <span className="mt-1 block text-sm text-slate-600">{detail}</span>
      </span>
      <input
        type="checkbox"
        className="mt-1 h-5 w-5"
        aria-label={label}
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
    </label>
  );
}

function clampNumber(value: string, min: number, max: number, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}
