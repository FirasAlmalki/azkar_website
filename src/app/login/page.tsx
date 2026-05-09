'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  return <AuthForm nextPath={next} />;
}

export default function LoginPage() {
  return (
    <main className="ow-page min-h-screen flex items-center justify-center px-4 py-12">
      <div className="stars-bg" />
      <Suspense fallback={<AuthForm />}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
