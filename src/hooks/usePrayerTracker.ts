'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export type PrayerStatus = 'on_time' | 'late' | 'missed' | 'pending';

export interface PrayerLog {
  prayer_date: string;  // YYYY-MM-DD
  prayer_name: PrayerName;
  status: PrayerStatus;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

export const PRAYER_EMOJIS: Record<PrayerName, string> = {
  fajr: '🌄',
  dhuhr: '☀️',
  asr: '🌤️',
  maghrib: '🌇',
  isha: '🌙',
};

export const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const DAY_LABELS = ['الجمعة', 'السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

/** Returns the most recent Friday on or before `date` */
export function getMostRecentFriday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
  const diff = (day - 5 + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

export function usePrayerTracker() {
  const [userId, setUserId] = useState<string | null>(null);
  const [firstFriday, setFirstFriday] = useState<Date | null>(null);
  const [currentWeekFriday, setCurrentWeekFriday] = useState<Date>(getMostRecentFriday(new Date()));
  const [logs, setLogs] = useState<Map<string, PrayerStatus>>(new Map()); // key: "YYYY-MM-DD:prayer"
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ── Load user + enrollment ── */
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setMounted(true); return; }
      setUserId(user.id);

      const { data: enrollment } = await supabase
        .from('prayer_enrollment')
        .select('first_friday')
        .eq('user_id', user.id)
        .maybeSingle();

      if (enrollment) {
        setFirstFriday(new Date(enrollment.first_friday));
      }
      setMounted(true);
    });
  }, []);

  /* ── Load logs for current week ── */
  useEffect(() => {
    if (!userId || !firstFriday) return;
    const supabase = createClient();
    const weekStart = toDateStr(currentWeekFriday);
    const weekEnd = toDateStr(addDays(currentWeekFriday, 6));

    supabase
      .from('prayer_logs')
      .select('prayer_date, prayer_name, status')
      .eq('user_id', userId)
      .gte('prayer_date', weekStart)
      .lte('prayer_date', weekEnd)
      .then(({ data }) => {
        const map = new Map<string, PrayerStatus>();
        (data ?? []).forEach(row => {
          map.set(`${row.prayer_date}:${row.prayer_name}`, row.status as PrayerStatus);
        });
        setLogs(map);
      });
  }, [userId, firstFriday, currentWeekFriday]);

  /* ── Enrollment ── */
  const enroll = useCallback(async () => {
    if (!userId) return;
    const friday = getMostRecentFriday(new Date());
    const supabase = createClient();
    const { error } = await supabase
      .from('prayer_enrollment')
      .insert({ user_id: userId, first_friday: toDateStr(friday) });
    if (!error) {
      setFirstFriday(friday);
      setCurrentWeekFriday(friday);
    }
  }, [userId]);

  const resetEnrollment = useCallback(async () => {
    if (!userId) return;
    const supabase = createClient();
    await supabase.from('prayer_enrollment').delete().eq('user_id', userId);
    await supabase.from('prayer_logs').delete().eq('user_id', userId);
    setFirstFriday(null);
    setLogs(new Map());
  }, [userId]);

  /* ── Log a prayer ── */
  const setPrayerStatus = useCallback(async (
    date: Date,
    prayerName: PrayerName,
    status: PrayerStatus
  ) => {
    if (!userId) return;
    const dateStr = toDateStr(date);
    const key = `${dateStr}:${prayerName}`;
    setLoading(true);

    const supabase = createClient();
    await supabase.from('prayer_logs').upsert(
      { user_id: userId, prayer_date: dateStr, prayer_name: prayerName, status },
      { onConflict: 'user_id,prayer_date,prayer_name' }
    );

    setLogs(prev => {
      const next = new Map(prev);
      next.set(key, status);
      return next;
    });
    setLoading(false);
  }, [userId]);

  /* ── Week navigation ── */
  const today = getMostRecentFriday(new Date());

  const canGoForward = firstFriday
    ? currentWeekFriday < today
    : false;

  const canGoBack = firstFriday
    ? currentWeekFriday > firstFriday
    : false;

  const goForward = useCallback(() => {
    setCurrentWeekFriday(prev => addDays(prev, 7));
  }, []);

  const goBack = useCallback(() => {
    setCurrentWeekFriday(prev => addDays(prev, -7));
  }, []);

  /* ── Stats for current week ── */
  const stats = (() => {
    let onTime = 0, late = 0, missed = 0;
    for (let i = 0; i < 7; i++) {
      const dateStr = toDateStr(addDays(currentWeekFriday, i));
      for (const p of PRAYER_ORDER) {
        const s = logs.get(`${dateStr}:${p}`);
        if (s === 'on_time') onTime++;
        else if (s === 'late') late++;
        else if (s === 'missed') missed++;
      }
    }
    return { onTime, late, missed };
  })();

  /* ── Days for display ── */
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekFriday, i));

  return {
    mounted,
    loading,
    firstFriday,
    currentWeekFriday,
    weekDays,
    logs,
    stats,
    canGoForward,
    canGoBack,
    goForward,
    goBack,
    enroll,
    resetEnrollment,
    setPrayerStatus,
  };
}
