'use client';

import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import AzkarImage from '@/components/home/AzkarImage';
import CountdownTimer from '@/components/home/CountdownTimer';
import RandomZikr from '@/components/home/RandomZikr';
import NavButtons from '@/components/home/NavButtons';
import DarkModeToggle from '@/components/home/DarkModeToggle';

const gradients = {
  morning: 'bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500',
  evening: 'bg-gradient-to-br from-indigo-600 via-purple-700 to-[#1a1a2e]',
};

export default function HomePage() {
  const { period, imageSrc, nextSwitchMs } = useTimeOfDay();

  return (
    <main className={`relative min-h-screen ${gradients[period]} transition-colors duration-1000`}>
      <DarkModeToggle />
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
        <AzkarImage period={period} imageSrc={imageSrc} />
        <CountdownTimer nextSwitchMs={nextSwitchMs} period={period} />
        <RandomZikr />
        <NavButtons />
      </div>
    </main>
  );
}
