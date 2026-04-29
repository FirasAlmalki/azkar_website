'use client';

import { RamadanReading } from '@/types';

interface Props {
  reading: RamadanReading;
  dayIndex: number;
  readingIndex: number;
  onToggle: (dayIndex: number, readingIndex: number) => void;
}

export default function ReadingItem({ reading, dayIndex, readingIndex, onToggle }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={reading.completed}
        onChange={() => onToggle(dayIndex, readingIndex)}
        className="w-5 h-5 rounded accent-green-500 cursor-pointer"
      />
      <span
        className={`flex-1 text-sm transition-all ${
          reading.completed
            ? 'line-through text-white/40'
            : 'text-white group-hover:text-white/80'
        }`}
      >
        {reading.emoji} {reading.name}
      </span>
    </label>
  );
}
