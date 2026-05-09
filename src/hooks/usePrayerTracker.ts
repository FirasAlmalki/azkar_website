'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientSafe } from '@/lib/supabase/client';

export type PrayerStatus = 'on_time' | 'late' | 'missed' | 'pending';
export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
};

export const PRAYER_EMOJIS: Record<PrayerName, string> = {
  fajr: '🌄', dhuhr: '☀️', asr: '🌤️', maghrib: '🌇', isha: '🌙',
};

export const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
export const DAY_LABELS = ['الجمعة', 'السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export function getMostRecentFriday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = (d.getDay() - 5 + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function usePrayerTracker() {
  const [userId, setUserId] = useState<string | null>(null);
  const [firstFriday, setFirstFriday] = useState<Date | null>(null);
  const [currentWeekFriday, setCurrentWeekFriday] = useState<Date>(getMostRecentFriday(new Date()));
  const [logs, setLogs] = useState<Map<string, PrayerStatus>>(new Map());
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClientSafe();
        if (!supabase) { setMounted(true); return; }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setMounted(true); return; }

        setUserId(user.id);

        const { data: enrollment } = await supabase
          .from('prayer_enrollment')
          .select('first_friday')
          .eq('user_id', user.id)
          .maybeSingle();

        if (enrollment) setFirstFriday(new Date(enrollment.first_friday));
      } catch {}
      setMounted(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!userId || !firstFriday) return;
    const fetchLogs = async () => {
      try {
        const supabase = createClientSafe();
        if (!supabase) return;

        const { data } = await supabase
          .from('prayer_logs')
          .select('prayer_date, prayer_name, status')
          .eq('user_id', userId)
          .gte('prayer_date', toDateStr(currentWeekFriday))
          .lte('prayer_date', toDateStr(addDays(currentWeekFriday, 6)));

        const map = new Map<string, PrayerStatus>();
        (data ?? []).forEach(r => map.set(`${r.prayer_date}:${r.prayer_name}`, r.status as PrayerStatus));
        setLogs(map);
      } catch {}
    };
    fetchLogs();
  }, [userId, firstFriday, currentWeekFriday]);

  const enroll = useCallback(async () => {
    if (!userId) return;
    try {
      const supabase = createClientSafe();
      if (!supabase) return;
      const friday = getMostRecentFriday(new Date());
      await supabase.from('prayer_enrollment').insert({ user_id: userId, first_friday: toDateStr(friday) });
      setFirstFriday(friday);
      setCurrentWeekFriday(friday);
    } catch {}
  }, [userId]);

  const resetEnrollment = useCallback(async () => {
    if (!userId) return;
    try {
      const supabase = createClientSafe();
      if (supabase) {
        await supabase.from('prayer_enrollment').delete().eq('user_id', userId);
        await supabase.from('prayer_logs').delete().eq('user_id', userId);
      }
    } catch {}
    setFirstFriday(null);
    setLogs(new Map());
  }, [userId]);

  const setPrayerStatus = useCallback(async (date: Date, prayerName: PrayerName, status: PrayerStatus) => {
    if (!userId) return;
    const dateStr = toDateStr(date);
    setLoading(true);
    try {
      const supabase = createClientSafe();
      if (supabase) {
        await supabase.from('prayer_logs').upsert(
          { user_id: userId, prayer_date: dateStr, prayer_name: prayerName, status },
          { onConflict: 'user_id,prayer_date,prayer_name' }
        );
      }
    } catch {}
    setLogs(prev => { const n = new Map(prev); n.set(`${dateStr}:${prayerName}`, status); return n; });
    setLoading(false);
  }, [userId]);

  const today = getMostRecentFriday(new Date());
  const canGoForward = firstFriday ? currentWeekFriday < today : false;
  const canGoBack = firstFriday ? currentWeekFriday > firstFriday : false;
  const goForward = useCallback(() => setCurrentWeekFriday(p => addDays(p, 7)), []);
  const goBack    = useCallback(() => setCurrentWeekFriday(p => addDays(p, -7)), []);

  const stats = (() => {
    let onTime = 0, late = 0, missed = 0;
    for (let i = 0; i < 7; i++) {
      const ds = toDateStr(addDays(currentWeekFriday, i));
      PRAYER_ORDER.forEach(p => {
        const s = logs.get(`${ds}:${p}`);
        if (s === 'on_time') onTime++;
        else if (s === 'late') late++;
        else if (s === 'missed') missed++;
      });
    }
    return { onTime, late, missed };
  })();

  return {
    mounted, loading, firstFriday, currentWeekFriday,
    weekDays: Array.from({ length: 7 }, (_, i) => addDays(currentWeekFriday, i)),
    logs, stats, canGoBack, canGoForward, goBack, goForward,
    enroll, resetEnrollment, setPrayerStatus,
  };
}
