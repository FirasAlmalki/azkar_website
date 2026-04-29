'use client';

import { useState, useEffect, useRef } from 'react';

const DURATION_MS = 15000;

export function useRandomZikr(azkarList: string[]) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        setIndex(i => (i + 1) % azkarList.length);
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index, azkarList.length]);

  return { currentZikr: azkarList[index], progress };
}
