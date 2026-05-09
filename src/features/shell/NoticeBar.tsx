import type { AppNotice } from '../../app/useLocalingoApp';

export function NoticeBar({ notice, onDismiss }: { notice: AppNotice | null; onDismiss: () => void }) {
  if (!notice) {
    return null;
  }

  return (
    <div className={`mx-auto mt-4 max-w-7xl border px-4 py-3 ${toneClassName(notice.tone)}`}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-black">{notice.title}</p>
          <p className="text-sm">{notice.detail}</p>
        </div>
        <button className="secondary-button" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

function toneClassName(tone: AppNotice['tone']) {
  switch (tone) {
    case 'success':
      return 'border-mint/30 bg-[#ecfdf5]';
    case 'warning':
      return 'border-[#f5b942]/40 bg-[#fff7d6]';
    case 'error':
      return 'border-[#f97361]/40 bg-[#fff7ed]';
    default:
      return 'border-black/10 bg-white';
  }
}
