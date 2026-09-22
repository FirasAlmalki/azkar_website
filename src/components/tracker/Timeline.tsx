'use client';

import { useMemo } from 'react';
import type { TrackerItem } from '@/hooks/useDailyTracker';
import TimelineItem from './TimelineItem';

interface Group {
  order: number;
  prayer?: TrackerItem;
  dhikr?: TrackerItem;
}

function groupItems(items: TrackerItem[]): Group[] {
  const map = new Map<number, Group>();
  items.forEach(it => {
    const g = map.get(it.sort_order) ?? { order: it.sort_order };
    if (it.column_side === 'prayer') g.prayer = it; else g.dhikr = it;
    map.set(it.sort_order, g);
  });
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

interface Props {
  items: TrackerItem[];
  completed: Set<number>;
  onToggle: (id: number) => void;
}

export default function Timeline({ items, completed, onToggle }: Props) {
  const groups = useMemo(() => groupItems(items), [items]);

  return (
    <div>
      {/* Column headers — left = prayers, right = adhkar/sunan, kept fixed regardless of RTL */}
      <div dir="ltr" className="grid grid-cols-2 gap-x-6 mb-3 px-1">
        <p className="text-ow-amber/70 text-xs font-bold text-center" dir="rtl">🕌 الصلوات</p>
        <p className="text-ow-amber/70 text-xs font-bold text-center" dir="rtl">📿 الأذكار والسنن</p>
      </div>

      <div dir="ltr" className="relative">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-ow-amber/50 via-ow-amber/20 to-ow-amber/50" />

        <div className="space-y-3">
          {groups.map(g => (
            <div key={g.order} className="grid grid-cols-2 gap-x-6 items-center relative">
              <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-ow-amber shrink-0 z-10" />
              <div dir="rtl">
                {g.prayer && (
                  <TimelineItem
                    item={g.prayer}
                    done={completed.has(g.prayer.id)}
                    onToggle={() => onToggle(g.prayer!.id)}
                  />
                )}
              </div>
              <div dir="rtl">
                {g.dhikr && (
                  <TimelineItem
                    item={g.dhikr}
                    done={completed.has(g.dhikr.id)}
                    onToggle={() => onToggle(g.dhikr!.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
