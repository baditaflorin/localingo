import { Activity, BookOpen, RotateCcw, Settings2, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { TabKey } from '../../app/useLocalingoApp';

export function TabBar({ tab, onTab }: { tab: TabKey; onTab: (tab: TabKey) => void }) {
  const tabs: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
    { key: 'lesson', label: 'Lesson', icon: <BookOpen size={16} /> },
    { key: 'review', label: 'Review', icon: <RotateCcw size={16} /> },
    { key: 'generate', label: 'Generate', icon: <Sparkles size={16} /> },
    { key: 'progress', label: 'Progress', icon: <Activity size={16} /> },
    { key: 'settings', label: 'Settings', icon: <Settings2 size={16} /> }
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-5" role="tablist" aria-label="Workspace">
      {tabs.map((item) => (
        <button
          key={item.key}
          className={`tab-button ${tab === item.key ? 'tab-button-active' : ''}`}
          onClick={() => onTab(item.key)}
          role="tab"
          aria-selected={tab === item.key}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
