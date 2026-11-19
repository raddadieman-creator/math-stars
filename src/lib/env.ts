export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
};
export function isConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnon);
}
export function aiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}
