'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Mode = 'login' | 'register';

export default function AuthForm({ nextPath = '/' }: { nextPath?: string }) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const supabase = createClient();

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        router.push(nextPath);
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.includes('already registered')) {
          setError('هذا البريد الإلكتروني مسجل مسبقاً');
        } else if (error.message.includes('Password')) {
          setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        } else {
          setError('حدث خطأ، حاول مجدداً');
        }
      } else {
        setSuccess('تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل دخولك.');
        setMode('login');
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Stars background card */}
      <div className="ow-card rounded-3xl p-8 shadow-2xl border border-ow-amber/20">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌌</div>
          <h1 className="text-2xl font-bold text-ow-cream">أذكاري</h1>
          <p className="text-ow-sand/70 text-sm mt-1">
            {mode === 'login' ? 'سجّل دخولك للمتابعة' : 'أنشئ حسابك الآن'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-2xl overflow-hidden border border-ow-amber/30 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-sm font-medium transition-all ${
              mode === 'login'
                ? 'bg-ow-amber text-[#0a0d17] font-bold'
                : 'text-ow-sand/70 hover:text-ow-cream'
            }`}
          >
            تسجيل دخول
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-sm font-medium transition-all ${
              mode === 'register'
                ? 'bg-ow-amber text-[#0a0d17] font-bold'
                : 'text-ow-sand/70 hover:text-ow-cream'
            }`}
          >
            حساب جديد
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-ow-sand/80 text-sm block mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              className="w-full ow-input"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-ow-sand/80 text-sm block mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full ow-input"
              dir="ltr"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/20 rounded-xl py-2 px-3 border border-red-500/30">
              ⚠️ {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 text-sm text-center bg-green-900/20 rounded-xl py-2 px-3 border border-green-500/30">
              ✅ {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full ow-btn-primary py-3 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? '...' : mode === 'login' ? 'دخول' : 'إنشاء حساب'}
          </button>
        </form>
      </div>
    </div>
  );
}
