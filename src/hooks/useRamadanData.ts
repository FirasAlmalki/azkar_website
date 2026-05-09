'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientSafe } from '@/lib/supabase/client';
import { RamadanData, RamadanDay } from '@/types';
import { PRAYERS } from '@/data/azkar';

const LOCAL_KEY = 'ramadanReadingData';

function buildFreshData(): RamadanData {
  const days: RamadanDay[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    readings: PRAYERS.map(p => ({ name: p.name, emoji: p.emoji, completed: false })),
  }));
  return { started: new Date().toISOString(), days };
}

export function useRamadanData() {
  const [data, setData] = useState<RamadanData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClientSafe();

        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          const uid = user?.id ?? null;
          setUserId(uid);

          if (uid) {
            const { data: row } = await supabase
              .from('ramadan_progress')
              .select('days, started_at')
              .eq('user_id', uid)
              .maybeSingle();

            setData(row ? { started: row.started_at, days: row.days as RamadanDay[] } : null);
            setMounted(true);
            return;
          }
        }
      } catch {}

      // Fallback: localStorage
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        setData(raw ? JSON.parse(raw) : null);
      } catch { setData(null); }
      setMounted(true);
    };

    load();
  }, []);

  useEffect(() => {
    if (!mounted || !data) return;

    if (userId) {
      try {
        const supabase = createClientSafe();
        if (supabase) {
          supabase
            .from('ramadan_progress')
            .upsert(
              { user_id: userId, days: data.days, started_at: data.started, updated_at: new Date().toISOString() },
              { onConflict: 'user_id' }
            )
            .then(() => {});
        }
      } catch {}
    } else {
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch {}
    }
  }, [data, mounted, userId]);

  const startProgram = useCallback(() => setData(buildFreshData()), []);

  const resetProgram = useCallback(async () => {
    try {
      if (userId) {
        const supabase = createClientSafe();
        if (supabase) await supabase.from('ramadan_progress').delete().eq('user_id', userId);
      } else {
        localStorage.removeItem(LOCAL_KEY);
      }
    } catch {}
    setData(null);
  }, [userId]);

  const toggleReading = useCallback((dayIndex: number, readingIndex: number) => {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((day, di) =>
          di !== dayIndex ? day : {
            ...day,
            readings: day.readings.map((r, ri) =>
              ri !== readingIndex ? r : { ...r, completed: !r.completed }
            ),
          }
        ),
      };
    });
  }, []);

  const stats = data ? (() => {
    const total = data.days.reduce((s, d) => s + d.readings.length, 0);
    const completed = data.days.reduce((s, d) => s + d.readings.filter(r => r.completed).length, 0);
    const completedDays = data.days.filter(d => d.readings.every(r => r.completed)).length;
    return { total, completed, remaining: total - completed, completedDays, remainingDays: 30 - completedDays };
  })() : null;

  return { data, mounted, startProgram, resetProgram, toggleReading, stats, userId };
}
