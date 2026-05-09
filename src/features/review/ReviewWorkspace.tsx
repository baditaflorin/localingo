import { useEffect, useState } from 'react';
import type { ReviewCard } from '../../lib/types';
import type { ReviewQuality } from './srs';

export function ReviewWorkspace({
  dueCards,
  onReview
}: {
  dueCards: ReviewCard[];
  onReview: (card: ReviewCard, quality: ReviewQuality) => void;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = dueCards[index % Math.max(dueCards.length, 1)];

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [dueCards.length]);

  if (!card) {
    return (
      <div className="workspace p-6">
        <h2 className="text-3xl font-black">Review queue clear</h2>
        <p className="mt-2 text-slate-600">New due cards will appear as your schedule matures.</p>
      </div>
    );
  }

  return (
    <div className="workspace p-6">
      <p className="text-sm font-bold uppercase text-slate-500">{dueCards.length} due now</p>
      <div className="my-6 grid min-h-64 place-items-center border border-black/10 bg-white p-6 text-center">
        <div>
          <p className="text-sm font-bold uppercase text-slate-500">Translate</p>
          <h2 className="mt-2 text-4xl font-black">{revealed ? card.back : card.front}</h2>
        </div>
      </div>
      {!revealed ? (
        <button className="primary-button w-full" onClick={() => setRevealed(true)}>
          Reveal
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {(
            [
              ['Again', 1],
              ['Hard', 3],
              ['Good', 4],
              ['Easy', 5]
            ] as const
          ).map(([label, quality]) => (
            <button
              key={label}
              className="answer-button"
              onClick={() => {
                onReview(card, quality);
                setRevealed(false);
                setIndex((value) => value + 1);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
