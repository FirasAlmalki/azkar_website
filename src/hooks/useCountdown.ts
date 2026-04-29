'use client';

import { useState, useEffect } from 'react';

function formatMs(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

export function useCountdown(targetMs: number): string {
  const [display, setDisplay] = useState('00:00:00');

  useEffect(() => {
    if (!targetMs) return;

    const tick = () => setDisplay(formatMs(targetMs - Date.now()));
    tick();

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return display;
}
