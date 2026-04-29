'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all"
      aria-label="تبديل الوضع الليلي"
    >
      {isDark ? '☀️ فاتح' : '🌙 داكن'}
    </button>
  );
}
