'use client';

import Link from 'next/link';

const buttons = [
  { href: 'https://b5b5.com/1/', label: '📖 سورة الكهف', external: true },
  { href: '/ramadan-reading',   label: '🌙 متابعة الختمة', external: false },
  { href: '/salah-tracker',     label: '🕌 تتبع الصلاة',   external: false },
  { href: '/zikr-calculator',   label: '📿 حاسبة الذكر',   external: false },
];

export default function NavButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {buttons.map(btn =>
        btn.external ? (
          <a
            key={btn.href}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ow-nav-btn"
          >
            {btn.label}
          </a>
        ) : (
          <Link key={btn.href} href={btn.href} className="ow-nav-btn">
            {btn.label}
          </Link>
        )
      )}
    </div>
  );
}
