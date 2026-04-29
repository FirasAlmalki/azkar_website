'use client';

import Image from 'next/image';
import { TimePeriod } from '@/types';

interface Props {
  period: TimePeriod;
  imageSrc: string;
}

const labels: Record<TimePeriod, string> = {
  morning: '🌅 أذكار الصباح',
  evening: '🌙 أذكار المساء',
};

export default function AzkarImage({ period, imageSrc }: Props) {
  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
      <Image
        src={imageSrc}
        alt={labels[period]}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30 flex items-end p-4">
        <h1 className="text-white text-2xl md:text-3xl font-bold drop-shadow">
          {labels[period]}
        </h1>
      </div>
    </div>
  );
}
