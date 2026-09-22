'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useDailyTracker } from '@/hooks/useDailyTracker';
import Timeline from '@/components/tracker/Timeline';
import ScoreBadge from '@/components/tracker/ScoreBadge';
import FriendsPanel from '@/components/tracker/FriendsPanel';
import IslamicDecor from '@/components/IslamicDecor';

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function TrackerPage() {
  const { signOut, username } = useAuth();
  const {
    mounted, items, completed, toggleItem, score,
    selectedDate, isToday, goToPrevDay, goToNextDay, goToToday,
  } = useDailyTracker();

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
      <IslamicDecor />
      <div className="relative max-w-2xl lg:max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/" className="ow-back-btn">← الرئيسية</Link>
          <h1 className="text-ow-cream text-xl font-bold">🕌 المتابعة اليومية</h1>
          {username ? (
            <button onClick={signOut} className="text-ow-sand/40 hover:text-ow-sand text-xs transition-colors">
              خروج
            </button>
          ) : <span className="w-10" />}
        </div>

        {/* Day navigator */}
        <div dir="ltr" className="flex items-center justify-between ow-card rounded-2xl px-4 py-3 border border-ow-amber/20 mb-5">
          <button onClick={goToPrevDay} className="text-ow-amber hover:text-ow-sand transition-colors text-lg px-2">
            ‹
          </button>
          <div dir="rtl" className="text-center">
            <p className="text-ow-cream font-bold text-sm">{formatDate(selectedDate)}</p>
            {!isToday && (
              <button onClick={goToToday} className="text-ow-amber/70 hover:text-ow-amber text-xs mt-0.5">
                الرجوع لليوم
              </button>
            )}
          </div>
          <button
            onClick={goToNextDay}
            disabled={isToday}
            className="text-ow-amber disabled:opacity-20 hover:text-ow-sand transition-colors text-lg px-2"
          >
            ›
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-6 space-y-5 lg:space-y-0">
          <div className="space-y-5">
            <ScoreBadge score={score} />
            <Timeline items={items} completed={completed} onToggle={toggleItem} />
          </div>
          <div>
            <FriendsPanel myScore={score} items={items} />
          </div>
        </div>
      </div>
    </main>
  );
}
