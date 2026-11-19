import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { env } from '../env';

/** عميل يحمل جلسة المعلم/الإدارة؛ يخضع لسياسات RLS */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* يُستدعى من Server Component: يتولى middleware التحديث */
        }
      },
    },
  });
}
