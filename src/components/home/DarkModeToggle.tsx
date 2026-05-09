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
      className="absolute top-4 left-4 z-20 bg-black/30 hover:bg-black/50 border border-ow-amber/30 text-ow-sand rounded-full px-3 py-1.5 text-xs backdrop-blur-sm transition-all"
      aria-label="تبديل الوضع"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
