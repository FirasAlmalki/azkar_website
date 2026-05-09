'use client';

import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import AzkarImage from '@/components/home/AzkarImage';
import CountdownTimer from '@/components/home/CountdownTimer';
import RandomZikr from '@/components/home/RandomZikr';
import NavButtons from '@/components/home/NavButtons';
import DarkModeToggle from '@/components/home/DarkModeToggle';

export default function HomePage() {
  const { period, imageSrc, nextSwitchMs } = useTimeOfDay();

  return (
    <main className="ow-page min-h-screen">
      <div className="stars-bg" />

      {/* Warm ambient glow based on time of day */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-2000"
        style={{
          background: period === 'morning'
            ? 'radial-gradient(ellipse at 50% 0%, rgba(232,148,58,0.12) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(58,62,165,0.10) 0%, transparent 60%)',
        }}
      />

      <DarkModeToggle />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-12 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1 mb-2">
          <h1 className="text-ow-cream text-3xl font-bold tracking-wide">أذكاري</h1>
          <p className="text-ow-sand/50 text-xs">استكشف — تذكّر — اطمئن</p>
        </div>

        <AzkarImage period={period} imageSrc={imageSrc} />
        <CountdownTimer nextSwitchMs={nextSwitchMs} period={period} />
        <RandomZikr />
        <NavButtons />
      </div>
    </main>
  );
}
