'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  usePrayerTracker,
  PRAYER_ORDER,
  DAY_LABELS,
  toDateStr,
  PrayerStatus,
} from '@/hooks/usePrayerTracker';
import PrayerRow from '@/components/salah/PrayerRow';
import StatsBar from '@/components/salah/StatsBar';

function formatDate(d: Date): string {
  return d.toLocaleDateString('ar-SA', { month: 'long', day: 'numeric' });
}

export default function SalahTrackerPage() {
  const { user, signOut } = useAuth();
  const {
    mounted, firstFriday, weekDays, logs, stats,
    canGoBack, canGoForward, goBack, goForward,
    enroll, resetEnrollment, setPrayerStatus,
    currentWeekFriday,
  } = usePrayerTracker();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!mounted) {
    return (
      <main className="ow-page min-h-screen flex items-center justify-center">
        <div className="stars-bg" />
        <div className="text-ow-cream animate-pulse text-xl">جاري التحميل...</div>
      </main>
    );
  }

  return (
    <main className="ow-page min-h-screen">
      <div className="stars-bg" />
      <div className="relative max-w-2xl mx-auto px-4 py-10 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="ow-back-btn">← الرئيسية</Link>
          <h1 className="text-ow-cream text-xl font-bold">🕌 تتبع الصلاة</h1>
          <div className="flex gap-2 items-center">
            {firstFriday && (
              <button onClick={resetEnrollment} className="text-red-400 hover:text-red-300 text-xs transition-colors">
                إعادة
              </button>
            )}
            {user && (
              <button onClick={signOut} className="text-ow-sand/40 hover:text-ow-sand text-xs transition-colors">
                خروج
              </button>
            )}
          </div>
        </div>

        {/* Not enrolled */}
        {!firstFriday ? (
          <div className="text-center py-20 space-y-6">
            <div className="text-6xl">🕌</div>
            <p className="text-ow-cream text-2xl font-bold">تتبع صلواتك الخمس</p>
            <p className="text-ow-sand/70 text-sm leading-relaxed max-w-xs mx-auto">
              سجّل صلواتك يومياً وتابع مدى التزامك — تبدأ من هذا الأسبوع
            </p>
            <button onClick={enroll} className="ow-btn-primary px-8 py-3 rounded-2xl text-lg font-bold">
              ابدأ التتبع
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <StatsBar {...stats} />

            {/* Week navigation */}
            <div className="flex items-center justify-between ow-card rounded-2xl px-4 py-3 border border-ow-amber/20">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                className="text-ow-amber disabled:opacity-20 hover:text-ow-sand transition-colors text-lg px-2"
              >
                ‹ السابق
              </button>
              <div className="text-center">
                <p className="text-ow-cream font-bold text-sm">
                  {formatDate(currentWeekFriday)} — {formatDate(weekDays[6])}
                </p>
                <p className="text-ow-sand/50 text-xs mt-0.5">
                  {currentWeekFriday.getTime() === (() => { const f = new Date(today); const d=(f.getDay()-5+7)%7; f.setDate(f.getDate()-d); f.setHours(0,0,0,0); return f.getTime(); })()
                    ? 'الأسبوع الحالي' : 'أسبوع سابق'}
                </p>
              </div>
              <button
                onClick={goForward}
                disabled={!canGoForward}
                className="text-ow-amber disabled:opacity-20 hover:text-ow-sand transition-colors text-lg px-2"
              >
                التالي ›
              </button>
            </div>

            {/* Days */}
            <div className="space-y-4">
              {weekDays.map((day, i) => {
                const dateStr = toDateStr(day);
                const dayDate = new Date(day);
                dayDate.setHours(0, 0, 0, 0);
                const isFuture = dayDate > today;
                const isToday = dateStr === toDateStr(today);

                return (
                  <div
                    key={dateStr}
                    className={`ow-card rounded-2xl p-4 border ${
                      isToday ? 'border-ow-amber/50' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-ow-cream font-bold">{DAY_LABELS[i]}</span>
                        {isToday && (
                          <span className="text-xs bg-ow-amber/20 text-ow-amber border border-ow-amber/30 rounded-full px-2 py-0.5">
                            اليوم
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-xs text-ow-sand/40">(لم يأتِ بعد)</span>
                        )}
                      </div>
                      <span className="text-ow-sand/50 text-xs">{formatDate(day)}</span>
                    </div>

                    <div className="divide-y divide-white/5">
                      {PRAYER_ORDER.map(prayer => {
                        const key = `${dateStr}:${prayer}`;
                        const status: PrayerStatus = logs.get(key) ?? 'pending';
                        return (
                          <PrayerRow
                            key={prayer}
                            prayer={prayer}
                            status={status}
                            disabled={isFuture}
                            onSet={s => setPrayerStatus(day, prayer, s)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
