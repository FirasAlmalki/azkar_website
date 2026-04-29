'use client';

import Link from 'next/link';

const buttons = [
  { href: 'https://b5b5.com/1/', label: '📖 سورة الكهف', external: true },
  { href: '/ramadan-reading', label: '🌙 متابعة الختمة', external: false },
  { href: '/zikr-calculator', label: '📿 حاسبة الذكر', external: false },
];

export default function NavButtons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {buttons.map(btn =>
        btn.external ? (
          <a
            key={btn.href}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl px-4 py-3 font-medium backdrop-blur-sm transition-all text-center"
          >
            {btn.label}
          </a>
        ) : (
          <Link
            key={btn.href}
            href={btn.href}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl px-4 py-3 font-medium backdrop-blur-sm transition-all text-center"
          >
            {btn.label}
          </Link>
        )
      )}
    </div>
  );
}
