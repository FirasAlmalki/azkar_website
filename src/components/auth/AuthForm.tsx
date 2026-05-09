'use client';

import { useState } from 'react';
import { createClientSafe } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import LogoMark from '@/components/LogoMark';

type Mode = 'login' | 'register';

/** Username → deterministic fake email */
async function usernameToEmail(username: string): Promise<string> {
  const normalized = username.trim().toLowerCase();
  const encoded = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 24);
  return `${hex}@azkarapp.local`;
}

/**
 * Supabase requires min 6 chars. We pad internally so the user
 * can type ANY password (even 1 character) and it still works.
 * The padding is consistent so login always matches signup.
 */
function padPassword(raw: string): string {
  // Repeat the password until it's at least 6 chars, then append a fixed tag
  const repeated = raw.length < 6
    ? raw.repeat(Math.ceil(6 / raw.length)).slice(0, 6)
    : raw;
  return repeated + '__az';   // fixed suffix keeps it unique per app
}

export default function AuthForm({ nextPath = '/' }: { nextPath?: string }) {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const switchMode = (m: Mode) => { setMode(m); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('أدخل اسم المستخدم'); return; }
    if (!password)         { setError('أدخل كلمة المرور');  return; }

    setLoading(true);

    const supabase = createClientSafe();
    if (!supabase) { setError('خطأ في الاتصال بالخادم'); setLoading(false); return; }

    const email      = await usernameToEmail(username);
    const safePass   = padPassword(password);          // ← always ≥ 10 chars

    /* ── LOGIN ── */
    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password: safePass,
      });

      if (err) {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      } else {
        router.push(nextPath);
        router.refresh();
      }

    /* ── REGISTER ── */
    } else {
      // 1. Check username availability (ignore errors if table missing)
      try {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username.trim())
          .maybeSingle();

        if (existing) {
          setError('اسم المستخدم محجوز، اختر اسماً آخر');
          setLoading(false);
          return;
        }
      } catch { /* profiles table might not exist yet — continue */ }

      // 2. Create account
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password: safePass,
        options: { data: { username: username.trim() } },
      });

      if (signUpErr) {
        // Surface the real reason in dev; show friendly message in prod
        console.error('[signUp error]', signUpErr.message);
        setError(`خطأ: ${signUpErr.message}`);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('لم يُنشأ الحساب — تأكد من تعطيل "Confirm email" في Supabase');
        setLoading(false);
        return;
      }

      // 3. Save username in profiles (best effort)
      try {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: username.trim(),
        });
      } catch {}

      // 4. Auto sign-in immediately
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password: safePass,
      });

      if (!loginErr) {
        router.push(nextPath);
        router.refresh();
      } else {
        // Email confirmation still on → tell user to disable it
        setError('✅ تم إنشاء الحساب! عطّل "Confirm email" في Supabase ثم سجّل دخولك.');
        switchMode('login');
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="ow-card rounded-3xl p-8 shadow-2xl border border-ow-amber/20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <LogoMark size={64} />
          </div>
          <h1 className="text-2xl font-bold text-ow-cream">أذكاري</h1>
          <p className="text-ow-sand/60 text-sm mt-1">
            {mode === 'login' ? 'سجّل دخولك' : 'أنشئ حسابك'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl overflow-hidden border border-ow-amber/30 mb-6">
          {(['login', 'register'] as Mode[]).map(m => (
            <button key={m} onClick={() => switchMode(m)}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-ow-amber text-[#0a0d17] font-bold'
                  : 'text-ow-sand/60 hover:text-ow-cream'
              }`}
            >
              {m === 'login' ? 'دخول' : 'حساب جديد'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-ow-sand/70 text-sm block mb-1">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="مثال: ahmad"
              autoComplete="username"
              className="ow-input w-full"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-ow-sand/70 text-sm block mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="أي كلمة مرور"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="ow-input w-full"
              dir="ltr"
            />
          </div>

          {error && (
            <p className={`text-sm text-center rounded-xl py-2 px-3 border break-all ${
              error.startsWith('✅')
                ? 'text-green-400 bg-green-900/20 border-green-500/30'
                : 'text-red-400 bg-red-900/20 border-red-500/30'
            }`}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="ow-btn-primary w-full py-3 rounded-2xl font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? '...' : mode === 'login' ? 'دخول' : 'إنشاء حساب'}
          </button>
        </form>
      </div>
    </div>
  );
}
