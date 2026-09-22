'use client';

import Link from 'next/link';

const buttons = [
  { href: '/tracker',           label: '🕌 المتابعة اليومية', external: false, full: true },
  { href: 'https://b5b5.com/1/', label: '📖 سورة الكهف', external: true, full: false },
  { href: '/zikr-calculator',   label: '📿 حاسبة الذكر',   external: false, full: false },
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
            className={`ow-nav-btn ${btn.full ? 'col-span-2' : ''}`}
          >
            {btn.label}
          </a>
        ) : (
          <Link key={btn.href} href={btn.href} className={`ow-nav-btn ${btn.full ? 'col-span-2' : ''}`}>
            {btn.label}
          </Link>
        )
      )}
    </div>
  );
}
