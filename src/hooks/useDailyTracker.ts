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

export function useDailyTracker() {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  const date = todayStr();

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

        const { data: logs } = await supabase
          .from('tracker_logs')
          .select('item_id, completed')
          .eq('user_id', user.id)
          .eq('log_date', date);

        const done = new Set<number>();
        (logs ?? []).forEach(l => { if (l.completed) done.add(l.item_id); });
        setCompleted(done);
      } catch {}
      setMounted(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        { user_id: userId, item_id: itemId, log_date: date, completed: willComplete, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,item_id,log_date' }
      );
    } catch {}
  }, [userId, completed, date]);

  const score = useMemo(() => {
    return Math.round(
      items.reduce((sum, it) => sum + (completed.has(it.id) ? it.percentage : 0), 0) * 10
    ) / 10;
  }, [items, completed]);

  return { mounted, userId, items, completed, toggleItem, score };
}
