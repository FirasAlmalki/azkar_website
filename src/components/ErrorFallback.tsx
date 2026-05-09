'use client';

import Link from 'next/link';

export default function ErrorFallback({ message }: { message?: string }) {
  return (
    <main className="ow-page min-h-screen flex items-center justify-center">
      <div className="stars-bg" />
      <div className="relative text-center space-y-4 p-8">
        <div className="text-5xl">🌌</div>
        <p className="text-ow-cream text-xl font-bold">
          {message ?? 'حدث خطأ غير متوقع'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="ow-btn-primary px-5 py-2 rounded-xl text-sm"
          >
            إعادة المحاولة
          </button>
          <Link href="/" className="ow-nav-btn px-5 py-2 rounded-xl text-sm">
            الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
