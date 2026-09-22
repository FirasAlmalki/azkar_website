'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClientSafe } from '@/lib/supabase/client';

export type ColumnSide = 'prayer' | 'dhikr';

export interface TrackerItem {
  id: number;
  key: string;
  label: string;
  column_side: ColumnSide;
  sort_order: number;
  percentage: number;
  is_critical: boolean;
}

export function todayStr(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().split('T')[0];
}

function addDaysStr(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function useDailyTracker() {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr());
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClientSafe();
        if (!supabase) { setMounted(true); return; }

        const { data: itemsData } = await supabase
          .from('tracker_items')
          .select('id, key, label, column_side, sort_order, percentage, is_critical')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        setItems((itemsData as TrackerItem[]) ?? []);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setMounted(true); return; }
        setUserId(user.id);
      } catch {}
      setMounted(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const loadLogs = async () => {
      setLogsLoading(true);
      try {
        const supabase = createClientSafe();
        if (!supabase) return;
        const { data: logs } = await supabase
          .from('tracker_logs')
          .select('item_id, completed')
          .eq('user_id', userId)
          .eq('log_date', selectedDate);

        if (cancelled) return;
        const done = new Set<number>();
        (logs ?? []).forEach(l => { if (l.completed) done.add(l.item_id); });
        setCompleted(done);
      } catch {}
      if (!cancelled) setLogsLoading(false);
    };
    loadLogs();
    return () => { cancelled = true; };
  }, [userId, selectedDate]);

  const toggleItem = useCallback(async (itemId: number) => {
    if (!userId) return;
    const willComplete = !completed.has(itemId);

    setCompleted(prev => {
      const next = new Set(prev);
      if (willComplete) next.add(itemId); else next.delete(itemId);
      return next;
    });

    try {
      const supabase = createClientSafe();
      if (!supabase) return;
      await supabase.from('tracker_logs').upsert(
        { user_id: userId, item_id: itemId, log_date: selectedDate, completed: willComplete, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,item_id,log_date' }
      );
    } catch {}
  }, [userId, completed, selectedDate]);

  const score = useMemo(() => {
    return Math.round(
      items.reduce((sum, it) => sum + (completed.has(it.id) ? it.percentage : 0), 0) * 10
    ) / 10;
  }, [items, completed]);

  const isToday = selectedDate === todayStr();
  const goToPrevDay = useCallback(() => setSelectedDate(d => addDaysStr(d, -1)), []);
  const goToNextDay = useCallback(() => setSelectedDate(d => {
    const next = addDaysStr(d, 1);
    return next > todayStr() ? d : next;
  }), []);
  const goToToday = useCallback(() => setSelectedDate(todayStr()), []);

  return {
    mounted, userId, items, completed, toggleItem, score,
    selectedDate, isToday, goToPrevDay, goToNextDay, goToToday, logsLoading,
  };
}
