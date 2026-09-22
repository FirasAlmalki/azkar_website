'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useDailyTracker } from '@/hooks/useDailyTracker';
import Timeline from '@/components/tracker/Timeline';
import ScoreBadge from '@/components/tracker/ScoreBadge';
import FriendsPanel from '@/components/tracker/FriendsPanel';
import IslamicDecor from '@/components/IslamicDecor';

export default function TrackerPage() {
  const { signOut, username } = useAuth();
  const { mounted, items, completed, toggleItem, score } = useDailyTracker();

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

        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-6 space-y-5 lg:space-y-0">
          <div className="space-y-5">
            <ScoreBadge score={score} />
            <Timeline items={items} completed={completed} onToggle={toggleItem} />
          </div>
          <div>
            <FriendsPanel myScore={score} />
          </div>
        </div>
      </div>
    </main>
  );
}
