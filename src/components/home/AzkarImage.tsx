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
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
      <Image
        src={imageSrc}
        alt={labels[period]}
        width={800}
        height={1200}
        className="w-full h-auto"
        priority
      />
      <div className="bg-black/40 px-4 py-3">
        <h1 className="text-white text-xl md:text-2xl font-bold text-center">
          {labels[period]}
        </h1>
      </div>
    </div>
  );
}
