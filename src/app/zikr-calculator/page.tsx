'use client';

import { useState } from 'react';
import Link from 'next/link';
import ZikrForm from '@/components/calculator/ZikrForm';
import ResultsDisplay from '@/components/calculator/ResultsDisplay';
import { ZikrResult } from '@/types';

const PRESET_COUNTS = [
  { count: 10, label: '١٠ مرات' },
  { count: 20, label: '٢٠ مرة' },
  { count: 30, label: '٣٠ مرة' },
  { count: 100, label: '١٠٠ مرة' },
];

export default function ZikrCalculatorPage() {
  const [zikrText, setZikrText] = useState('');
  const [secondsPerZikr, setSecondsPerZikr] = useState('');
  const [results, setResults] = useState<ZikrResult[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculate = () => {
    const errs: string[] = [];
    if (!zikrText.trim()) errs.push('يرجى إدخال اسم الذكر');
    const secs = parseFloat(secondsPerZikr);
    if (!secondsPerZikr || isNaN(secs) || secs <= 0) errs.push('يرجى إدخال وقت صحيح (أكبر من صفر)');

    if (errs.length) {
      setErrors(errs);
      setResults(null);
      return;
    }

    setErrors([]);
    setResults(
      PRESET_COUNTS.map(({ count, label }) => ({
        count,
        label,
        seconds: count * secs,
      }))
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-[#1a1a2e]">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors"
          >
            ← الرئيسية
          </Link>
          <h1 className="text-white text-xl font-bold">📿 حاسبة الذكر</h1>
          <div className="w-16" />
        </div>

        <ZikrForm
          zikrText={zikrText}
          secondsPerZikr={secondsPerZikr}
          onZikrTextChange={setZikrText}
          onSecondsChange={setSecondsPerZikr}
          onCalculate={calculate}
          errors={errors}
        />

        {results && (
          <ResultsDisplay
            results={results}
            secondsPerZikr={parseFloat(secondsPerZikr)}
            zikrText={zikrText}
          />
        )}
      </div>
    </main>
  );
}
