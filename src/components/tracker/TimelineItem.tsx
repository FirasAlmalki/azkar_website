'use client';

import type { TrackerItem } from '@/hooks/useDailyTracker';

interface Props {
  item: TrackerItem;
  done: boolean;
  onToggle: () => void;
}

export default function TimelineItem({ item, done, onToggle }: Props) {
  const criticalRing = item.is_critical && !done;

  return (
    <button
      onClick={onToggle}
      className={`ow-card w-full rounded-xl px-3 py-2.5 border text-right transition-all ${
        done
          ? 'border-green-500/50 bg-green-900/10'
          : criticalRing
          ? 'border-red-500/50'
          : 'border-ow-amber/20 hover:border-ow-amber/50'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm font-medium ${done ? 'text-ow-sand/50 line-through' : 'text-ow-cream'}`}>
          {item.label}
        </span>
        <span
          className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
            done
              ? 'bg-green-500 border-green-400 text-[#0a0d17]'
              : criticalRing
              ? 'border-red-400 text-red-400'
              : 'border-ow-sand/30 text-transparent'
          }`}
        >
          ✓
        </span>
      </div>
    </button>
  );
}
