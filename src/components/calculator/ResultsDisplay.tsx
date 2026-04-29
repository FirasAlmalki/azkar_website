'use client';

import { ZikrResult } from '@/types';
import { useState } from 'react';

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} ثانية`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m} دقيقة و${s} ثانية` : `${m} دقيقة`;
}

interface Props {
  results: ZikrResult[];
  secondsPerZikr: number;
  zikrText: string;
}

export default function ResultsDisplay({ results, secondsPerZikr, zikrText }: Props) {
  const [customCount, setCustomCount] = useState('');
  const [customError, setCustomError] = useState('');
  const [customResult, setCustomResult] = useState<string | null>(null);

  const handleCustom = () => {
    const n = parseInt(customCount, 10);
    if (!customCount || isNaN(n) || n <= 0) {
      setCustomError('أدخل عدداً صحيحاً أكبر من صفر');
      setCustomResult(null);
      return;
    }
    setCustomError('');
    setCustomResult(formatTime(n * secondsPerZikr));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {results.map(r => (
          <div
            key={r.count}
            className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center"
          >
            <p className="text-white/70 text-xs mb-1">{r.label}</p>
            <p className="text-white font-bold text-lg">{formatTime(r.seconds)}</p>
            <p className="text-white/50 text-xs mt-1">{r.count} مرة</p>
          </div>
        ))}
      </div>

      <div className="bg-white/10 border border-white/20 rounded-2xl p-5 space-y-3">
        <p className="text-white/80 text-sm">احسب لعدد مخصص</p>
        <div className="flex gap-2">
          <input
            type="number"
            value={customCount}
            onChange={e => setCustomCount(e.target.value)}
            placeholder="عدد المرات"
            min="1"
            className="flex-1 bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors"
          />
          <button
            onClick={handleCustom}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl px-4 py-2 font-medium transition-all"
          >
            احسب
          </button>
        </div>
        {customError && <p className="text-red-300 text-sm">⚠️ {customError}</p>}
        {customResult && (
          <p className="text-white font-bold text-center text-lg">
            {zikrText} × {customCount} = {customResult}
          </p>
        )}
      </div>
    </div>
  );
}
