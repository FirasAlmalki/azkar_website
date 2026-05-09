'use client';

import { useRandomZikr } from '@/hooks/useRandomZikr';
import { AZKAR_LIST } from '@/data/azkar';

export default function RandomZikr() {
  const { currentZikr, progress } = useRandomZikr(AZKAR_LIST);
  return (
    <div className="ow-card border border-ow-amber/20 rounded-2xl p-6 text-center space-y-4">
      <p className="text-ow-sand/50 text-xs">✨ ذكر اليوم</p>
      <p className="text-ow-cream text-2xl md:text-3xl font-bold leading-relaxed min-h-[3rem] flex items-center justify-center">
        {currentZikr}
      </p>
      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-none"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #e8943a, #d4622a)',
          }}
        />
      </div>
    </div>
  );
}
