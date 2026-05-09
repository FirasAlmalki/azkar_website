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
          <div key={r.count} className="ow-card border border-ow-amber/20 rounded-2xl p-4 text-center">
            <p className="text-ow-sand/60 text-xs mb-1">{r.label}</p>
            <p className="text-ow-amber font-bold text-lg">{formatTime(r.seconds)}</p>
            <p className="text-ow-sand/40 text-xs mt-1">{r.count} مرة</p>
          </div>
        ))}
      </div>
      <div className="ow-card border border-ow-amber/20 rounded-2xl p-5 space-y-3">
        <p className="text-ow-sand/80 text-sm">احسب لعدد مخصص</p>
        <div className="flex gap-2">
          <input
            type="number"
            value={customCount}
            onChange={e => setCustomCount(e.target.value)}
            placeholder="عدد المرات"
            min="1"
            className="ow-input flex-1"
          />
          <button onClick={handleCustom} className="ow-btn-primary px-4 py-2 rounded-xl text-sm">
            احسب
          </button>
        </div>
        {customError && <p className="text-red-400 text-sm">⚠️ {customError}</p>}
        {customResult && (
          <p className="text-ow-cream font-bold text-center text-lg">
            {zikrText} × {customCount} = {customResult}
          </p>
        )}
      </div>
    </div>
  );
}
