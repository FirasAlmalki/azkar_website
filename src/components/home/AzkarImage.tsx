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
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-ow-amber/20">
      <Image
        src={imageSrc}
        alt={labels[period]}
        width={800}
        height={1200}
        className="w-full h-auto"
        priority
      />
      <div className="bg-black/60 px-4 py-3 border-t border-ow-amber/20">
        <h2 className="text-ow-amber text-lg font-bold text-center">{labels[period]}</h2>
      </div>
    </div>
  );
}
