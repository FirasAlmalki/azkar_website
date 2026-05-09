'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClientSafe } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientSafe();
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getUser()
      .then(({ data }) => { setUser(data.user); setLoading(false); })
      .catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    try {
      const supabase = createClientSafe();
      if (supabase) await supabase.auth.signOut();
    } catch {}
    window.location.href = '/login';
  }, []);

  return { user, loading, signOut };
}
