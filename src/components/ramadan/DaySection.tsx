'use client';

import { RamadanDay } from '@/types';
import ReadingItem from './ReadingItem';

interface Props {
  day: RamadanDay;
  dayIndex: number;
  onToggle: (dayIndex: number, readingIndex: number) => void;
}

export default function DaySection({ day, dayIndex, onToggle }: Props) {
  const allDone = day.readings.every(r => r.completed);
  return (
    <div className={`ow-card rounded-2xl p-5 border transition-all ${
      allDone ? 'border-green-500/40' : 'border-ow-amber/15'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-ow-cream font-bold text-lg">اليوم {day.day}</h3>
        {allDone && <span className="text-green-400 text-sm">✅ مكتمل</span>}
      </div>
      <div className="space-y-3">
        {day.readings.map((reading, ri) => (
          <ReadingItem key={ri} reading={reading} dayIndex={dayIndex} readingIndex={ri} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}
