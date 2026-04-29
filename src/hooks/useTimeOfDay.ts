'use client';

import { useState, useEffect } from 'react';
import { TimeOfDayState } from '@/types';

function computeState(): TimeOfDayState {
  const now = new Date();
  const hour = now.getHours();
  const isMorning = hour >= 4 && hour < 16;

  const nextSwitch = new Date(now);
  if (isMorning) {
    nextSwitch.setHours(16, 0, 0, 0);
  } else {
    if (hour >= 16) {
      nextSwitch.setDate(nextSwitch.getDate() + 1);
    }
    nextSwitch.setHours(4, 0, 0, 0);
  }

  return {
    period: isMorning ? 'morning' : 'evening',
    imageSrc: isMorning ? '/morning.jpg' : '/evening.jpg',
    nextSwitchMs: nextSwitch.getTime(),
  };
}

export function useTimeOfDay(): TimeOfDayState {
  const [state, setState] = useState<TimeOfDayState>({
    period: 'morning',
    imageSrc: '/morning.jpg',
    nextSwitchMs: 0,
  });

  useEffect(() => {
    setState(computeState());

    const interval = setInterval(() => {
      const next = computeState();
      setState(prev => (prev.period !== next.period ? next : { ...prev, nextSwitchMs: next.nextSwitchMs }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return state;
}
