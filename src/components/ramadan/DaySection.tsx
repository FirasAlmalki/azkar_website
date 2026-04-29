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
    <div
      className={`rounded-2xl p-5 border transition-all ${
        allDone
          ? 'bg-green-500/20 border-green-400/40'
          : 'bg-white/10 border-white/20'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">اليوم {day.day}</h3>
        {allDone && (
          <span className="text-green-300 text-sm font-medium">✅ مكتمل</span>
        )}
      </div>
      <div className="space-y-3">
        {day.readings.map((reading, ri) => (
          <ReadingItem
            key={ri}
            reading={reading}
            dayIndex={dayIndex}
            readingIndex={ri}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
