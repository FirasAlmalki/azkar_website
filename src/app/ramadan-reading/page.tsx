'use client';

import Link from 'next/link';
import { useRamadanData } from '@/hooks/useRamadanData';
import Dashboard from '@/components/ramadan/Dashboard';
import DaySection from '@/components/ramadan/DaySection';

export default function RamadanReadingPage() {
  const { data, mounted, startProgram, resetProgram, toggleReading, stats } = useRamadanData();

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-[#1a1a2e] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">جاري التحميل...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-[#1a1a2e]">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors"
          >
            ← الرئيسية
          </Link>
          <h1 className="text-white text-xl font-bold">🌙 متابعة الختمة</h1>
          {data && (
            <button
              onClick={resetProgram}
              className="text-red-300 hover:text-red-200 text-sm transition-colors"
            >
              إعادة تعيين
            </button>
          )}
        </div>

        {!data ? (
          <div className="text-center space-y-6 py-16">
            <p className="text-white text-2xl font-bold">برنامج ختم القرآن في رمضان</p>
            <p className="text-white/70">5 أوراد يومياً لمدة 30 يوماً</p>
            <button
              onClick={startProgram}
              className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 rounded-2xl text-lg transition-all shadow-lg"
            >
              ابدأ البرنامج
            </button>
          </div>
        ) : (
          <>
            {stats && <Dashboard stats={stats} />}

            <div className="space-y-4">
              {data.days.map((day, di) => (
                <DaySection
                  key={day.day}
                  day={day}
                  dayIndex={di}
                  onToggle={toggleReading}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
