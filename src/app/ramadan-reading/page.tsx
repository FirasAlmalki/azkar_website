'use client';

import Link from 'next/link';
import { useRamadanData } from '@/hooks/useRamadanData';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/ramadan/Dashboard';
import DaySection from '@/components/ramadan/DaySection';

export default function RamadanReadingPage() {
  const { data, mounted, startProgram, resetProgram, toggleReading, stats } = useRamadanData();
  const { user, signOut } = useAuth();

  if (!mounted) {
    return (
      <main className="ow-page min-h-screen flex items-center justify-center">
        <div className="stars-bg" />
        <div className="text-ow-cream text-xl animate-pulse">جاري التحميل...</div>
      </main>
    );
  }

  return (
    <main className="ow-page min-h-screen">
      <div className="stars-bg" />
      <div className="relative max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="ow-back-btn">← الرئيسية</Link>
          <h1 className="text-ow-cream text-xl font-bold">🌙 متابعة الختمة</h1>
          <div className="flex items-center gap-2">
            {data && (
              <button onClick={resetProgram} className="text-red-400 hover:text-red-300 text-sm transition-colors">
                إعادة تعيين
              </button>
            )}
            {user && (
              <button onClick={signOut} className="text-ow-sand/50 hover:text-ow-sand text-xs transition-colors">
                خروج
              </button>
            )}
          </div>
        </div>

        {/* User info */}
        {user && (
          <p className="text-ow-sand/50 text-xs text-center">
            مسجّل كـ {user.email}
          </p>
        )}

        {!data ? (
          <div className="text-center space-y-6 py-16">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-ow-cream text-2xl font-bold">برنامج ختم القرآن</p>
            <p className="text-ow-sand/70">5 أوراد يومياً لمدة 30 يوماً — محفوظة في حسابك</p>
            <button onClick={startProgram} className="ow-btn-primary px-8 py-3 rounded-2xl text-lg font-bold">
              ابدأ البرنامج
            </button>
          </div>
        ) : (
          <>
            {stats && <Dashboard stats={stats} />}
            <div className="space-y-4">
              {data.days.map((day, di) => (
                <DaySection key={day.day} day={day} dayIndex={di} onToggle={toggleReading} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
