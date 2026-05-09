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
    <div className="ow-card border border-ow-amber/20 rounded-2xl px-6 py-4 text-center">
      <p className="text-ow-sand/60 text-xs mb-1">الوقت المتبقي لـ {nextLabel[period]}</p>
      <p className="text-ow-amber text-3xl font-mono font-bold tracking-widest">{countdown}</p>
    </div>
  );
}
