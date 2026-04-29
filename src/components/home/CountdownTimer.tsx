'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { TimePeriod } from '@/types';

interface Props {
  nextSwitchMs: number;
  period: TimePeriod;
}

const nextLabel: Record<TimePeriod, string> = {
  morning: 'أذكار المساء',
  evening: 'أذكار الصباح',
};

export default function CountdownTimer({ nextSwitchMs, period }: Props) {
  const countdown = useCountdown(nextSwitchMs);

  return (
    <div className="text-center bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
      <p className="text-white/80 text-sm mb-1">الوقت المتبقي لـ {nextLabel[period]}</p>
      <p className="text-white text-3xl font-mono font-bold tracking-widest">{countdown}</p>
    </div>
  );
}
