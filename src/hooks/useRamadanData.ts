'use client';

import { useState, useEffect, useCallback } from 'react';
import { RamadanData, RamadanDay } from '@/types';
import { PRAYERS } from '@/data/azkar';

const STORAGE_KEY = 'ramadanReadingData';

function buildFreshData(): RamadanData {
  const days: RamadanDay[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    readings: PRAYERS.map(p => ({ name: p.name, emoji: p.emoji, completed: false })),
  }));
  return { started: new Date().toISOString(), days };
}

function loadFromStorage(): RamadanData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RamadanData) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: RamadanData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

export function useRamadanData() {
  const [data, setData] = useState<RamadanData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setData(loadFromStorage());
    setMounted(true);
  }, []);

  const startProgram = useCallback(() => {
    const fresh = buildFreshData();
    saveToStorage(fresh);
    setData(fresh);
  }, []);

  const resetProgram = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(null);
  }, []);

  const toggleReading = useCallback((dayIndex: number, readingIndex: number) => {
    setData(prev => {
      if (!prev) return prev;
      const updated: RamadanData = {
        ...prev,
        days: prev.days.map((day, di) =>
          di !== dayIndex
            ? day
            : {
                ...day,
                readings: day.readings.map((r, ri) =>
                  ri !== readingIndex ? r : { ...r, completed: !r.completed }
                ),
              }
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const stats = data
    ? (() => {
        const total = data.days.reduce((sum, d) => sum + d.readings.length, 0);
        const completed = data.days.reduce(
          (sum, d) => sum + d.readings.filter(r => r.completed).length,
          0
        );
        const completedDays = data.days.filter(d => d.readings.every(r => r.completed)).length;
        return { total, completed, remaining: total - completed, completedDays, remainingDays: 30 - completedDays };
      })()
    : null;

  return { data, mounted, startProgram, resetProgram, toggleReading, stats };
}
