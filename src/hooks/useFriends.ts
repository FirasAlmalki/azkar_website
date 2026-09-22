'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientSafe } from '@/lib/supabase/client';
import { todayStr } from './useDailyTracker';

export interface FriendScore {
  id: string;
  username: string;
  score: number;
}

export function useFriends(myScore: number) {
  const [userId, setUserId] = useState<string | null>(null);
  const [myUsername, setMyUsername] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const supabase = createClientSafe();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setMyUsername(user.user_metadata?.username ?? null);

      const { data: friendRows } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      const friendIds = (friendRows ?? []).map(r => r.friend_id as string);
      if (friendIds.length === 0) { setFriends([]); return; }

      const [{ data: profiles }, { data: scores }] = await Promise.all([
        supabase.from('profiles').select('id, username').in('id', friendIds),
        supabase.from('daily_scores').select('user_id, score').eq('log_date', todayStr()).in('user_id', friendIds),
      ]);

      const scoreMap = new Map<string, number>();
      (scores ?? []).forEach(s => scoreMap.set(s.user_id, Number(s.score) || 0));

      const list: FriendScore[] = (profiles ?? []).map(p => ({
        id: p.id,
        username: p.username,
        score: scoreMap.get(p.id) ?? 0,
      }));

      setFriends(list);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const addFriend = useCallback(async (username: string) => {
    setError('');
    const uname = username.trim();
    if (!uname) return;
    if (!userId) { setError('يجب تسجيل الدخول'); return; }
    if (myUsername && uname.toLowerCase() === myUsername.toLowerCase()) {
      setError('لا يمكنك إضافة نفسك');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClientSafe();
      if (!supabase) { setError('خطأ في الاتصال'); setLoading(false); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', uname)
        .maybeSingle();

      if (!profile) {
        setError('لا يوجد مستخدم بهذا الاسم');
        setLoading(false);
        return;
      }

      if (friends.some(f => f.id === profile.id)) {
        setError('مضاف بالفعل');
        setLoading(false);
        return;
      }

      await supabase.from('friends').insert({ user_id: userId, friend_id: profile.id });
      await load();
    } catch {
      setError('تعذّرت الإضافة');
    }
    setLoading(false);
  }, [userId, myUsername, friends, load]);

  const removeFriend = useCallback(async (friendId: string) => {
    if (!userId) return;
    setFriends(prev => prev.filter(f => f.id !== friendId));
    try {
      const supabase = createClientSafe();
      if (supabase) await supabase.from('friends').delete().eq('user_id', userId).eq('friend_id', friendId);
    } catch {}
  }, [userId]);

  const leaderboard = [{ id: userId ?? 'me', username: myUsername ?? 'أنا', score: myScore, isMe: true }, ...friends.map(f => ({ ...f, isMe: false }))]
    .sort((a, b) => b.score - a.score);

  return { leaderboard, addFriend, removeFriend, loading, error, setError };
}
