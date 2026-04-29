'use client';

import { useRandomZikr } from '@/hooks/useRandomZikr';
import { AZKAR_LIST } from '@/data/azkar';

export default function RandomZikr() {
  const { currentZikr, progress } = useRandomZikr(AZKAR_LIST);

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center space-y-4">
      <p className="text-white/70 text-sm">ذكر اليوم</p>
      <p className="text-white text-2xl md:text-3xl font-bold leading-relaxed min-h-[3rem] flex items-center justify-center">
        {currentZikr}
      </p>
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
