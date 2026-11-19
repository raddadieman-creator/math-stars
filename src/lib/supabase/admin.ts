import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { env } from '../env';

/**
 * عميل بمفتاح الخدمة — للخادم فقط.
 * يُستخدم حصريًا لعمليات الطالب بعد التحقق من جلستها، وكل استعلام فيه مقيد بمعرّفها.
 */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY غير مضبوط');
  return createClient(env.supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
