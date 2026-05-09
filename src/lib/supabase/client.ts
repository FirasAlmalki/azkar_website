import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase env vars missing');
  }

  return createBrowserClient(url, key);
}

/** Returns null instead of throwing — use in hooks that must not crash */
export function createClientSafe() {
  try {
    return createClient();
  } catch {
    return null;
  }
}
